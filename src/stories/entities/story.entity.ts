import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { Chapter } from './chapter.entity';
import { StoryCategory } from './story-category.entity';
import { StoryMeta } from './story-meta.entity';
import { StoryWriter } from './story-writer';

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
  @Column({ type: 'text', nullable: true })
  description?: string;
  @Column({ type: 'int', nullable: true })
  coverId?: number;
  @Column({ type: 'int', nullable: true })
  categoryId: number;
  @Column({ type: 'varchar', length: 10, default: 'id' })
  languageId: string;
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: StoryType;
  @Column({ type: 'boolean', default: false })
  hasCompleted: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters: Chapter[];
  @ManyToOne(() => StoryCategory, (category) => category.stories, {
    eager: true,
    nullable: true,
  })
  category: StoryCategory;
  @Column({ type: 'simple-array', default: '' })
  tags: string[];
  @ManyToOne(() => Media, { nullable: true, eager: true })
  cover: Media;
  @OneToOne(() => StoryMeta, (meta) => meta.story, {
    eager: true,
    nullable: true,
  })
  meta: StoryMeta;
  @ManyToMany(() => User, {
    cascade: true,
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    synchronize: false,
    name: 'story_writer',
    joinColumn: { name: 'storyId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  writers: StoryWriter[];
}
