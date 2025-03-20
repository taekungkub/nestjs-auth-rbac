import { Controller, Post, Body, Request, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    const data = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );
    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }
}
