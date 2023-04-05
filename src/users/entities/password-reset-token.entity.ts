import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'varchar', length: 255 })
  token: string;
  @Column({ type: 'json', nullable: true })
  meta?: any;
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  expiredAt: Date;
  @ManyToOne(() => User, (user) => user.passwordResetTokens, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
