import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChapterMeta } from './chapter-meta.entity';
import { Story } from './story.entity';

export type ChapterStatus = 'draft' | 'published';
export type ChapterCommentStatus = 'enabled' | 'disabled' | 'moderated';

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
  status: ChapterStatus;
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  price: number;
  @Column({
    type: 'enum',
    enum: ['enabled', 'disabled', 'moderated'],
    default: 'enabled',
  })
  commentStatus: ChapterCommentStatus;
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
}
