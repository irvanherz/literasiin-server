import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity()
export class ChapterMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  chapterId: number;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @Column({ type: 'int', default: 0 })
  numVotes: number;
  @Column({ type: 'int', default: 0 })
  numReads: number;
  @Column({ type: 'int', default: 0 })
  numReaders: number;
  @OneToOne(() => Chapter, (chapter) => chapter.meta, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  chapter: Chapter;
}
