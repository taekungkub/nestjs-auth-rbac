import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, username, email } = createUserDto;

    // ✅ Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // ✅ Save user with hashed password & required fields
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
      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Update only the fields that are provided
    const updatedUser = await this.userRepository.save({
      ...user, // Keep existing user data
      ...updateUserDto, // Only overwrite with provided fields
    });

    // Remove the password before returning the response
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(userId: string) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    await this.userRepository.remove(user);
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
}
