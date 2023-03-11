import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChapterMeta } from './chapter-meta.entity';
import { ChapterVote } from './chapter-vote.entity';
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
  @ManyToOne(() => Story, (story) => story.chapters, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  story: Story;
  @OneToOne(() => ChapterMeta, (meta) => meta.chapter, {
    eager: true,
    nullable: true,
  })
  meta?: ChapterMeta;
  @OneToMany(() => ChapterVote, (vote) => vote.chapter)
  votes: ChapterVote[];
}
