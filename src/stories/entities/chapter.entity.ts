import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Story } from './story.entity';

type StoryType = 'draft' | 'published';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storyId: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'text', nullable: true })
  description?: string;
  @Column({ type: 'text', nullable: true })
  content?: string;
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: StoryType;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User, (user) => user.stories)
  user: User;
  @ManyToOne(() => Story, (story) => story.chapters)
  story: Story;
}
