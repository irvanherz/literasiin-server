import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ValueTransformer,
  VirtualColumn,
} from 'typeorm';
import { Storytelling } from './storytelling.entity';

const NumberTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue,
  from: (databaseValue: string) => +databaseValue,
};

@Entity()
export class StorytellingMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storytellingId: number;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @Column({ type: 'int', default: 0 })
  numVotes: number;

  @OneToOne(() => Storytelling, (storytelling) => storytelling.meta, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  storytelling: Storytelling;
  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(*) FROM storytelling_episode c WHERE c."storytellingId"=${alias}."storytellingId"`,
    transformer: NumberTransformer,
  })
  numEpisodes: number;
  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(*) FROM storytelling_episode c WHERE c."storytellingId"=${alias}."storytellingId" AND c.status='published'`,
    transformer: NumberTransformer,
  })
  numPublishedEpisodes: number;
}
