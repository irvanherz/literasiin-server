import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { StorytellingEpisode } from './storytelling-episode.entity';

@Entity()
@Unique(['episodeId', 'userId'])
export class StorytellingEpisodeAudience {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  episodeId: number;
  @Column()
  userId: number;
  @Column({ type: 'boolean', default: false })
  vote: boolean;
  @Column({ type: 'int', default: 0 })
  numListens: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => StorytellingEpisode, { onDelete: 'CASCADE' })
  episode: StorytellingEpisode;
}
