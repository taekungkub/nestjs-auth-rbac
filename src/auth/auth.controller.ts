import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );
    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const data = await this.authService.register(createUserDto);
    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }
}
