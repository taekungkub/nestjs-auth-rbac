import { Module } from '@nestjs/common';
import { MyLogService } from './my-log.service';
import { MyLogController } from './my-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLog } from './entities/my-log.entity';
import { User } from '@/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MyLog])],
  controllers: [MyLogController],
  providers: [MyLogService],
  exports: [MyLogService],
})
export class MyLogModule {}
