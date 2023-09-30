import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity()
@Unique(['chapterId', 'userId'])
export class ChapterReader {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  chapterId: number;
  @Column()
  userId: number;
  @Column({ type: 'boolean', default: false })
  vote: boolean;
  @Column({ type: 'int', default: 0 })
  numReads: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
  chapter: Chapter;
}
