import { IRole } from '@/common/types/role.type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(30, { message: 'Password must not exceed 30 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsInt({ each: true })
  roles: number[];

  @IsOptional()
  picture?: string;
}

export class UserResponse {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name?: string;
  @ApiProperty({ example: ['admin', 'user', 'guest'] as IRole[] })
  roles: string[];
  @ApiProperty()
  picture?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: UserResponse })
  data: UserResponse;
}
