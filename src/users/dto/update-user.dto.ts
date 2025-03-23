import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Expose()
  name: string;

  @IsOptional()
  oldPassword: string;
}
