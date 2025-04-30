import { Injectable } from '@nestjs/common';
import { SearchDashboardDto } from './dto/search-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Between, MoreThan, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsersRegisteredInLast30Days(): Promise<User[]> {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    return this.userRepository.find({
      where: {
        createdAt: MoreThan(date),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getUsersInDateRange(dto: SearchDashboardDto): Promise<User[]> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    return this.userRepository.find({
      where: {
        createdAt: Between(start, end),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
