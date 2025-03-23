import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Put,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  // @Roles('admin')
  // @Permissions('create:user')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      return {
        statusCode: HttpStatus.OK,
        data: {
          ...user,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    try {
      const user = await this.usersService.findAll();

      return {
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);

    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @UseGuards(JwtGuard, RolesGuard, PermissionsGuard)
  @Roles('admin')
  @Permissions('delete:user')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);

      return {
        statusCode: HttpStatus.OK,
        data: 'user deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }
  }

  @Patch(':id/roles')
  async updateRoles(
    @Param('id') userId: string,
    @Body('roles') roleIds: number[],
  ) {
    try {
      await this.usersService.updateUserRoles(userId, roleIds);
      return {
        statusCode: HttpStatus.OK,
        data: 'User roles updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }
  }

  @UseGuards(JwtGuard)
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
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    }),
  )
  async updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto, // Accept multiple fields
    @UploadedFile() file: Express.Multer.File, // Handle file separately
  ) {
    return this.usersService.updateProfile(
      req.user['userId'],
      updateProfileDto,
      file,
    );
  }
}
