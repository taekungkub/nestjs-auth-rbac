import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from './albums/albums.module';
import { Album } from './albums/entities/album.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { PermissionModule } from './permission/permission.module';
import { Permission } from './permission/entities/permission.entity';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { CLS_IP_ADDRESS, CLS_USER_AGENT } from './common/cls.constants';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: './app.sqlite',
    //   entities: [Album, User, Role, Permission],
    //   synchronize: process.env.NODE_ENV != 'production',
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER ?? 'nestuser',
      password: process.env.DB_PASSWORD ?? 'nestpassword',
      database: process.env.DB_NAME ?? 'nestdb',
      entities: [Album, User, Role, Permission],
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV != 'production',
      extra: {
        timezone: 'Asia/Bangkok', // ✅ บังคับใช้ Timezone
        options: '-c timezone=Asia/Bangkok', // 🔥 บังคับให้ PostgreSQL ใช้ GMT+7
      },
    }),
    EventEmitterModule.forRoot(),
    ClsModule.forRoot({
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        setup: (cls, req) => {
          cls.set(CLS_USER_AGENT, req.headers['user-agent']);
          cls.set(CLS_IP_ADDRESS, req.ip);
        },
      },
    }),
    CacheModule.register(),
    AlbumsModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
