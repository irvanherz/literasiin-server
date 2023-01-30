import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';

type StoryType = 'draft' | 'published';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'text' })
  description?: string;
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
  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters: Chapter[];
}
