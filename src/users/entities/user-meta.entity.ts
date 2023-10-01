import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', unique: true })
  userId: number;
  @Column({ type: 'int', default: 0 })
  numFollowers: number;
  @Column({ type: 'int', default: 0 })
  numFollowing: number;
  @Column({ type: 'int', default: 0 })
  numStories: number;
  @Column({ type: 'int', default: 0 })
  numPublishedStories: number;
  @Column({ type: 'int', default: 0 })
  numPublishedArticles: number;
  @Column({ type: 'int', default: 0 })
  numStoryVotes: number;
  @Column({ type: 'int', default: 0 })
  numArticleVotes: number;
}
