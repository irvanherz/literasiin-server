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
@Unique(['storyId', 'userId'])
export class StoryBookmark {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storyId: number;
  @Column()
  userId: number;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => Story)
  story: Story;
  @ManyToOne(() => User)
  user: User;
}
