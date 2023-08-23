import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Storytelling } from './storytelling.entity';

@Entity()
export class StorytellingMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storytellingId: number;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @Column({ type: 'int', default: 0 })
  numListens: number;
  @Column({ type: 'int', default: 0 })
  numListeners: number;
  @Column({ type: 'int', default: 0 })
  numVotes: number;
  @Column({ type: 'int', default: 0 })
  numEpisodes: number;
  @Column({ type: 'int', default: 0 })
  numPublishedEpisodes: number;

  @OneToOne(() => Storytelling, (storytelling) => storytelling.meta, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  storytelling: Storytelling;
}
