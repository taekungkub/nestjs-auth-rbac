import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
}
