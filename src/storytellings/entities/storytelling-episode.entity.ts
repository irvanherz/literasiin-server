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
import { StorytellingEpisodeMeta } from './storytelling-episode-meta.entity';
import { Storytelling } from './storytelling.entity';

export type ChapterStatus = 'draft' | 'published';
export type ChapterCommentStatus = 'enabled' | 'disabled' | 'moderated';

@Entity()
export class StorytellingEpisode {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storytellingId: number;
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
  @ManyToOne(() => Storytelling, (storytelling) => storytelling.episodes, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  storytelling: Storytelling;
  @OneToOne(() => StorytellingEpisodeMeta, (meta) => meta.episode, {
    eager: true,
    nullable: true,
  })
  meta?: StorytellingEpisodeMeta;
}
