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
import { Chapter } from './chapter.entity';
import { Story } from './story.entity';

@Entity()
export class StoryComment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  storyId: number;
  @Column({ type: 'int' })
  chapterId: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'int', nullable: true })
  parentId: number;
  @Column({ type: 'varchar', length: 255 })
  comment: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Story, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  story: Story;
  @ManyToOne(() => Chapter, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  chapter: Chapter;
  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent?: StoryComment;
}
