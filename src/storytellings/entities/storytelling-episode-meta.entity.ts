import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StorytellingEpisode } from './storytelling-episode.entity';

@Entity()
export class StorytellingEpisodeMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  episodeId: number;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @Column({ type: 'int', default: 0 })
  numVotes: number;
  @OneToOne(() => StorytellingEpisode, (episode) => episode.meta, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  episode: StorytellingEpisode;
}
