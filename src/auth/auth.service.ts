import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LogEvent } from '@/common/events/log-event';
import { NotificationService } from '@/notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationService: NotificationService,
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
      roles: user.roles,
      permissions: user.permissions,
    };

    console.log(payload);

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    this.eventEmitter.emit(
      'auth.login',
      new LogEvent(
        user.userId,
        user.username,
        user.roles,
        'login',
        'เข้าสู่ระบบสำเร็จ',
        '/login',
        '',
      ),
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      this.notificationService.send(`📩 New user registered: ${user.email}`);

      return {
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

  async refreshToken(userId: string) {
    const user = await this.usersService.findOne(userId);

    const payload = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      name: user.name,
      roles: user.roles,
      permissions: user.permissions,
    };

    const token = this.jwtService.sign(payload);
    return {
      userId,
      token,
    };
  }
}
