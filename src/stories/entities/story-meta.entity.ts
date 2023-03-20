import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from './story.entity';

@Entity()
export class StoryMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storyId: number;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @Column({ type: 'int', default: 0 })
  numVotes: number;

  @OneToOne(() => Story, (story) => story.meta, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  story: Story;
}
