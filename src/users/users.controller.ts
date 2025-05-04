import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Put,
  UseInterceptors,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserInterceptor } from './interceptor/user.interceptor';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  // @Roles('admin')
  // @Permissions('create:user')
  @UseInterceptors(UserInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return {
      statusCode: HttpStatus.OK,
      data: {
        ...user,
      },
    };
  }

  @UseGuards(JwtGuard, RolesGuard, PermissionsGuard)
  @Roles(['admin'])
  @Permissions(['read:user'])
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users')
  @Get()
  @ApiResponse({ status: 200, description: 'Success', type: UserResponseDto })
  async findAll() {
    const user = await this.usersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(UserInterceptor)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);

    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  // @UseGuards(JwtGuard, RolesGuard, PermissionsGuard)
  // @Roles('admin')
  // @Permissions('delete:user')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      data: 'user deleted successfully',
    };
  }

  @Patch(':id/roles')
  async updateRoles(
    @Param('id') userId: string,
    @Body('roles') roleIds: number[],
  ) {
    await this.usersService.updateUserRoles(userId, roleIds);
    return {
      statusCode: HttpStatus.OK,
      data: 'User roles updated successfully',
    };
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(UserInterceptor)
  @Put('profile')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB limit
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const user = await this.usersService.updateProfile(
      req.user['userId'],
      updateProfileDto,
      file,
    );

    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
