import { Injectable } from '@nestjs/common';
import { CreateMyLogDto } from './dto/create-my-log.dto';
import { MyLog } from './entities/my-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { SearchMyLogDTO } from './dto/search-my-log.dto';

@Injectable()
export class MyLogService {
  constructor(
    @InjectRepository(MyLog)
    private readonly myLogRepository: Repository<MyLog>,
  ) {}

  create(createMyLogDto: CreateMyLogDto) {
    return this.myLogRepository.save(createMyLogDto);
  }

  async findAll(searchMyLogDTO: SearchMyLogDTO) {
    const { page, limit, search } = searchMyLogDTO;

    const skip = (page - 1) * limit;

    let whereConditions: any = {};

    if (search) {
      whereConditions = [
        { action: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ];
    }

    const [data, total] = await this.myLogRepository.findAndCount({
      where: whereConditions,
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      count: total,
      totalPage: Math.ceil(total / limit),
    };
  }
}
