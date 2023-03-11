import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity()
export class ChapterVote {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  chapterId: number;
  @Column()
  userId: number;
  @ManyToOne(() => Chapter, (chapter) => chapter.votes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chapterId' })
  chapter: Chapter;
}
