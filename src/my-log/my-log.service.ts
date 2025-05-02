import { Injectable } from '@nestjs/common';
import { CreateMyLogDto } from './dto/create-my-log.dto';
import { UpdateMyLogDto } from './dto/update-my-log.dto';
import { MyLog } from './entities/my-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MyLogService {
  constructor(
    @InjectRepository(MyLog)
    private readonly myLogRepository: Repository<MyLog>,
  ) {}

  create(createMyLogDto: CreateMyLogDto) {
    return this.myLogRepository.save(createMyLogDto);
  }

  async findAll() {
    return await this.myLogRepository.find();
  }
}
