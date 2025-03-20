import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  BadRequestException,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const album = await this.albumsService.create(createAlbumDto);

    return {
      statusCode: HttpStatus.OK,
      data: {
        ...album,
      },
    };
  }

  @Get()
  async findAll() {
    const albums = await this.albumsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: albums,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const album = await this.albumsService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        data: album,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const album = await this.albumsService.update(+id, updateAlbumDto);

    return {
      statusCode: HttpStatus.OK,
      data: {
        ...album,
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.albumsService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new BadRequestException(`${error}`);
    }

    return {
      statusCode: HttpStatus.OK,
      data: 'Album deleted successfully',
    };
  }
}
