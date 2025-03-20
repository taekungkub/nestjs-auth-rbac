import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number; // Auto-incremented primary key

  @Column({ length: 30 })
  title: string;

  @Column({ length: 255, nullable: true }) // Optional column
  remark?: string;
}
