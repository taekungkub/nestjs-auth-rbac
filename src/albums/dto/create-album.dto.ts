import { IsString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string; // ชื่ออัลบั้ม

  @IsString()
  @IsOptional()
  remark?: string; // คำอธิบายของอัลบั้ม (ไม่บังคับ)
}
