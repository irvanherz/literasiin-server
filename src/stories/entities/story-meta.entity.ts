import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { Story } from './story.entity';

const NumberTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue,
  from: (databaseValue: string) => +databaseValue,
};

@Entity()
export class StoryMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  storyId: number;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @Column({ type: 'int', default: 0 })
  numViewers: number;
  @Column({ type: 'int', default: 0 })
  numVotes: number;
  @Column({ type: 'int', default: 0 })
  numReads: number;
  @Column({ type: 'int', default: 0 })
  numReaders: number;
  @Column({ type: 'int', default: 0 })
  numChapters: number;
  @Column({ type: 'int', default: 0 })
  numPublishedChapters: number;
  @Column({ type: 'int', default: 0 })
  numBookmarks: number;

  @OneToOne(() => Story, (story) => story.meta, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  story: Story;
  // @VirtualColumn({
  //   type: 'int',
  //   query: (alias) =>
  //     `SELECT COUNT(*) FROM chapter c WHERE c."storyId"=${alias}."storyId"`,
  //   transformer: NumberTransformer,
  // })
  // numChapters: number;
  // @VirtualColumn({
  //   type: 'int',
  //   query: (alias) =>
  //     `SELECT COUNT(*) FROM chapter c WHERE c."storyId"=${alias}."storyId" AND c.status='published'`,
  //   transformer: NumberTransformer,
  // })
  // numPublishedChapters: number;
}
