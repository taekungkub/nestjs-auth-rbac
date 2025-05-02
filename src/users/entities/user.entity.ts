import { MyLog } from '@/my-log/entities/my-log.entity';
import { Role } from '@/roles/entities/role.entity';
import { Expose } from 'class-transformer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  userId: string;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 30 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 30, nullable: true })
  name?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.name, { eager: true, cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ type: 'text', nullable: true }) // Store image as Base64
  picture?: string;

  @OneToMany(() => MyLog, (log) => log.user, { eager: false })
  logs: MyLog[];

  @Expose()
  get localUpdatedAt(): string {
    return dayjs(this.updatedAt)
      .tz('Asia/Bangkok')
      .format('YYYY-MM-DD HH:mm:ss');
  }

  @Expose()
  get localCreatedAt(): string {
    return dayjs(this.createdAt)
      .tz('Asia/Bangkok')
      .format('YYYY-MM-DD HH:mm:ss');
  }
}
