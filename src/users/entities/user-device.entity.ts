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
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({
    type: 'enum',
    enum: ['web', 'android', 'ios', 'other'],
    default: 'other',
  })
  deviceType: 'web' | 'android' | 'ios' | 'other' = 'other';
  @Column({ type: 'varchar', length: 255 })
  deviceId: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  notificationToken?: string;
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  user: User;
}
