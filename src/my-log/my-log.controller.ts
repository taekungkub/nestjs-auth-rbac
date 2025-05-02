import { Controller, Get, Post, Body } from '@nestjs/common';
import { MyLogService } from './my-log.service';
import { CreateMyLogDto } from './dto/create-my-log.dto';

@Controller('my-log')
export class MyLogController {
  constructor(private readonly myLogService: MyLogService) {}

  @Post()
  create(@Body() createMyLogDto: CreateMyLogDto) {
    return this.myLogService.create(createMyLogDto);
  }

  @Get()
  findAll() {
    return this.myLogService.findAll();
  }
}
