import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Between, MoreThan, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

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

  async getUsersInDateRange(dto: CreateDashboardDto): Promise<User[]> {
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
