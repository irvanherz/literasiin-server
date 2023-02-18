import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

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
}
