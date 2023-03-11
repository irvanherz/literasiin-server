import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['storyId', 'tagId'])
export class StoryTagMap {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  storyId: number;
  @Column({ type: 'int' })
  tagId: number;
  @CreateDateColumn()
  createdAt: Date;
}
