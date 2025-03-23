import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user') // ตรงกับชื่อ table
export class User {
  @PrimaryGeneratedColumn()
  userId: string;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 30 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 30, nullable: true })
  name?: string;

  // @CreateDateColumn({ type: 'timestamp' }) // Auto set when row is created
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) // ✅ Works in SQLite
  createdAt: Date;

  // @UpdateDateColumn({ type: 'timestamp' }) // Auto update when row is modified
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }) // ✅ Works in SQLite
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
}
