import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Story } from './story.entity';

@Entity()
@Unique(['storyId', 'chapterId', 'userId'])
export class StoryAccess {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storyId: number;
  @Column()
  chapterId: number;
  @Column()
  userId: number;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => Story, { onDelete: 'CASCADE' })
  story: Story;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
