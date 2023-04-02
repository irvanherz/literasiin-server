import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleCategory } from './article-category.entity';
import { ArticleMeta } from './article-meta.entity';

type ArticleStatus = 'draft' | 'published';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'varchar', length: 255 })
  title: string;
  @Column({ type: 'text', nullable: true })
  description?: string;
  @Column({ type: 'text', nullable: true })
  content?: string;
  @Column({ type: 'int', nullable: true })
  imageId?: number;
  @Column({ type: 'int', nullable: true })
  categoryId: number;
  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: ArticleStatus;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => User, { eager: true })
  user: User;
  @ManyToOne(() => Media)
  image: Media;
  @ManyToOne(() => ArticleCategory, (category) => category.articles, {
    eager: true,
  })
  category: ArticleCategory;
  @OneToOne(() => ArticleMeta, (meta) => meta.article, {
    eager: true,
    nullable: true,
  })
  meta: ArticleMeta;
}
