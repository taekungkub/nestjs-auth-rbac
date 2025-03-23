import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Connection, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly connection: Connection, // ใช้ QueryRunner
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, username, email, roles } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ ค้นหา Roles ที่ส่งมา

    const roleEntities = await this.roleRepository.find({
      where: { id: In(roles) }, // ค้นหา roles ตาม ID
    });

    if (roleEntities.length !== roles.length) {
      throw new BadRequestException('Invalid role ID(s)');
    }

    // ✅ สร้าง User และแนบ Roles
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }
  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['roles', 'roles.permissions'],
      });
      if (!user) {
        throw new Error('User not found');
      }

      return {
        ...user,
        roles: user.roles.map((role) => role.name), // ["admin", "user" , "guest"]
        permissions: Array.from(
          new Set(
            user.roles.flatMap((role) =>
              role.permissions.map((perm) => perm.name),
            ),
          ),
        ), // ['create:user', 'update:user'],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // ✅ ถ้ามีการส่ง roles มา ต้องแปลง role IDs เป็น Role entities
    if (updateUserDto.roles) {
      const roleEntities = await this.roleRepository.find({
        where: { id: In(updateUserDto.roles) },
      });

      if (roleEntities.length !== updateUserDto.roles.length) {
        throw new BadRequestException('Invalid role ID(s)');
      }

      user.roles = roleEntities; // อัปเดต roles ใหม่
      user.updatedAt = new Date(); // อัปเดต timestamp
    }
    const filteredData = plainToInstance(UpdateUserDto, updateUserDto, {
      excludeExtraneousValues: true,
    });

    Object.assign(user, filteredData);

    await this.userRepository.save(user);

    if (updateUserDto.roles) {
      await this.updateUserRoles(user.userId, updateUserDto.roles);
    }

    return user;
  }

  async remove(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    await this.userRepository.remove(user);
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return this.findOne(user?.userId);
  }

  async updateUserRoles(userId: string, roleIds: number[]) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // ✅ ใช้ Transaction เพื่อให้ SQLite อัปเดต `user_roles` ได้ถูกต้อง
    await this.connection.transaction(async (manager) => {
      // ✅ ลบ roles เดิมของ user
      await manager
        .createQueryBuilder()
        .delete()
        .from('user_roles')
        .where('user_id = :userId', { userId })
        .execute();

      // ✅ ถ้ามี roles ใหม่ให้เพิ่มเข้าไป
      if (roleIds.length > 0) {
        const values = roleIds.map((roleId) => ({
          user_id: userId,
          role_id: roleId,
        }));

        await manager
          .createQueryBuilder()
          .insert()
          .into('user_roles')
          .values(values)
          .execute();
      }
    });

    return { message: 'User roles updated successfully' };
  }
}
