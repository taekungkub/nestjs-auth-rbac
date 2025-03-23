import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    const existingUser = await this.roleRepository.findOne({
      where: [{ name }],
    });

    if (existingUser) {
      throw new BadRequestException('Name already exists');
    }

    const role = this.roleRepository.create({
      name,
    });

    await this.roleRepository.save(role);

    return role;
  }

  async findAll() {
    return await this.roleRepository.find();
  }
  async findOne(id: number) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
      });
      if (!role) {
        throw new Error('Role not found');
      }

      return {
        ...role,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    Object.assign(role, {
      name: updateRoleDto.name,
    });

    return role;
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }

    await this.roleRepository.remove(role);
  }

  async updateRolePermission(roleId: number, permissionIds: number[]) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    if (!permissionIds?.length) {
      throw new NotFoundException(`Permissions not found`);
    }

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (permissions.length !== permissionIds.length) {
      throw new BadRequestException('Invalid permission ID(s)');
    }

    role.permissions = permissions;

    await this.roleRepository.save(role);

    return role;
  }
}
