import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleCategory } from './article-category.entity';

type ArticleStatus = 'draft' | 'published';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;
  @Column({ type: 'text' })
  description?: string;
  @Column({ type: 'text', nullable: true })
  content?: string;
  @Column({ type: 'int', nullable: true })
  imageId?: number;
  @Column({ type: 'int' })
  categoryId: number;
  @Column({ type: 'enum', enum: ['draft', 'published'] })
  status: ArticleStatus;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User, (user) => user.stories)
  user: User;
  @ManyToOne(() => Media)
  image: Media;
  @ManyToOne(() => ArticleCategory, (category) => category.articles)
  category: ArticleCategory;
}
