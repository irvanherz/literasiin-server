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
} from 'typeorm';
import { StorytellingAuthor } from './storytelling-author.entity';
import { StorytellingCategory } from './storytelling-category.entity';
import { StorytellingEpisode } from './storytelling-episode.entity';
import { StorytellingMeta } from './storytelling-meta.entity';

type StorytellingType = 'draft' | 'published';

export const NumberTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue,
  from: (databaseValue: string) => +databaseValue,
};

@Entity()
export class Storytelling {
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
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: StorytellingType;
  @Column({ type: 'boolean', default: false })
  hasCompleted: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => StorytellingEpisode, (episode) => episode.storytelling)
  episodes: StorytellingEpisode[];
  @ManyToOne(() => StorytellingCategory, (category) => category.storytellings, {
    eager: true,
    nullable: true,
  })
  category: StorytellingCategory;
  @OneToOne(() => Media)
  @JoinColumn()
  cover: Media;
  @OneToOne(() => StorytellingMeta, (meta) => meta.storytelling, {
    eager: true,
    nullable: true,
  })
  meta: StorytellingMeta;
  @ManyToMany(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    synchronize: false,
    name: 'storytelling_author',
    joinColumn: { name: 'storytellingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  authors: StorytellingAuthor[];
}
