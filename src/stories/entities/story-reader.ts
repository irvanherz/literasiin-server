import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Story } from './story.entity';

@Entity()
@Unique(['storyId', 'userId'])
export class StoryReader {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storyId: number;
  @Column()
  userId: number;
  @Column({ type: 'boolean', default: false })
  bookmark: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  story: Story;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
