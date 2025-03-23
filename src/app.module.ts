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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: './app.sqlite',
    //   entities: [Album, User, Role, Permission],
    //   synchronize: process.env.NODE_ENV != 'production',
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'nestuser',
      password: process.env.DB_PASSWORD || 'nestpassword',
      database: process.env.DB_NAME || 'nestdb',
      entities: [Album, User, Role, Permission],
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV != 'production',
      extra: {
        timezone: 'Asia/Bangkok', // ✅ บังคับใช้ Timezone
        options: '-c timezone=Asia/Bangkok', // 🔥 บังคับให้ PostgreSQL ใช้ GMT+7
      },
      // timezone: '+07:00', // ตั้งค่าโซนเวลาไทย
    }),
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
