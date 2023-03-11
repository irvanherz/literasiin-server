import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from './story.entity';

@Entity()
export class StoryTag {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToMany(() => Story, (story) => story.tags)
  @JoinTable({
    synchronize: false,
    name: 'story_tag_map',
    joinColumn: { name: 'tagId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'storyId', referencedColumnName: 'id' },
  })
  stories: Story[];
}
