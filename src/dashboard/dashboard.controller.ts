import { Controller, Get, Post, Body } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SearchDashboardDto } from './dto/search-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('user_last_30_days')
  getUserFromLast30Days() {
    return this.dashboardService.getUsersRegisteredInLast30Days();
  }

  @Post('get_users_in_date_range')
  getUsersInDateRange(@Body() searchDashboardDto: SearchDashboardDto) {
    return this.dashboardService.getUsersInDateRange(searchDashboardDto);
  }
}
