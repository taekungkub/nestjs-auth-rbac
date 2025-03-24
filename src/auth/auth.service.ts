import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.roles,
      permissions: user.permissions,
    };

    console.log(payload);

    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      return {
        statusCode: HttpStatus.OK,
        data: {
          ...user,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }
  }
}
