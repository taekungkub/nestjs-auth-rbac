import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>, // Injecting the album repository for DB operations
  ) {}

  // Create a new album
  async create(createAlbumDto: CreateAlbumDto) {
    const album = this.albumRepository.create(createAlbumDto); // Convert DTO to an entity
    return await this.albumRepository.save(album); // Save the new album in the DB
  }

  // Get all albums
  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  // Get one album by id
  async findOne(id: number): Promise<Album | null> {
    try {
      const album = await this.albumRepository.findOne({ where: { id } });
      if (!album) {
        throw new Error('Album not found');
      }
      return album;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Update an album by ID
  async update(id: number, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new Error(`Album with ID ${id} not found`);
    }

    // Update the album with the new data
    const updatedAlbum = Object.assign(album, updateAlbumDto);
    return await this.albumRepository.save(updatedAlbum);
  }

  // Remove an album by ID
  async remove(id: number): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new Error(`Album with ID ${id} not found`);
    }

    await this.albumRepository.remove(album);
  }
}
