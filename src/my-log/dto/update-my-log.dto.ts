import { PartialType } from '@nestjs/mapped-types';
import { CreateMyLogDto } from './create-my-log.dto';

export class UpdateMyLogDto extends PartialType(CreateMyLogDto) {}
