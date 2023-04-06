import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['userId', 'deviceId'])
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({
    type: 'enum',
    enum: ['id', 'en'],
    default: 'en',
  })
  lang: 'en' | 'id';
  @Column({
    type: 'enum',
    enum: ['light', 'light'],
    default: 'light',
  })
  theme: 'light' | 'dark';
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  user: User;
}
