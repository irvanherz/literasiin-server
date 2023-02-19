import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserFollow {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  followerId: number;
  @Column({ type: 'int' })
  followingId: number;
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.followers)
  follower: User;

  @ManyToOne(() => User, (user) => user.following)
  following: User;
}
