import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import { AuthLogListener } from './events/auth-log.listener';
import { ClsModule } from 'nestjs-cls';
import { NotificationModule } from '@/notification/notification.module';
import { MyLogModule } from '@/my-log/my-log.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ClsModule,
    NotificationModule,
    MyLogModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshJwtStrategy,
    AuthLogListener,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
