import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
@Unique(['articleId', 'userId'])
export class ArticleReader {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  articleId: number;
  @Column()
  userId: number;
  @Column({ type: 'boolean', default: false })
  bookmark: boolean;
  @Column({ type: 'int', default: 0 })
  vote: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article: Article;
  @ManyToOne(() => User)
  user: User;
}
