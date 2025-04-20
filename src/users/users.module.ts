import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '@/roles/entities/role.entity';
import { ClsModule } from 'nestjs-cls';
import { UserLogListener } from './events/users-log.listener';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), ClsModule],
  providers: [UsersService, UserLogListener],
  exports: [UsersService], // ✅ Export UsersService so AuthModule can use it
  controllers: [UsersController],
})
export class UsersModule {}
