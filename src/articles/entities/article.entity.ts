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
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'text' })
  description?: string;
  @Column({ type: 'text' })
  content?: string;
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: ArticleStatus;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User, (user) => user.stories)
  user: User;
  @ManyToOne(() => ArticleCategory, (category) => category.articles)
  category: ArticleCategory;
}
