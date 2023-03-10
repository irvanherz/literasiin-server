import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
  VirtualColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';
import { StoryCategory } from './story-category.entity';
import { StoryMeta } from './story-meta.entity';
import { StoryTag } from './story-tag.entity';

type StoryType = 'draft' | 'published';

export const NumberTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue,
  from: (databaseValue: string) => +databaseValue,
};

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'text' })
  description?: string;
  @Column({ type: 'int', nullable: true })
  coverId?: number;
  @Column({ type: 'int', nullable: true })
  categoryId: number;
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: StoryType;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User, (user) => user.stories)
  user: User;
  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters: Chapter[];
  @ManyToOne(() => StoryCategory, (category) => category.stories, {
    eager: true,
    nullable: true,
  })
  category: StoryCategory;
  @ManyToMany(() => StoryTag, (tag) => tag.stories, { eager: true })
  @JoinTable({
    synchronize: false,
    name: 'story_tag_map',
    joinColumn: { name: 'storyId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: StoryTag[];
  @OneToOne(() => Media)
  @JoinColumn()
  cover: Media;
  @OneToOne(() => StoryMeta, (meta) => meta.story, {
    eager: true,
    nullable: true,
  })
  meta: StoryMeta;

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(id) FROM "chapter" WHERE "storyId"=${alias}.id`,
    transformer: NumberTransformer,
  })
  numChapters: number;
  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(id) FROM "chapter" WHERE "storyId"=${alias}.id AND status='published'`,
    transformer: NumberTransformer,
  })
  numPublishedChapters: number;
}
