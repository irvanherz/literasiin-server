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
import { Article } from '../../articles/entities/article.entity';

@Entity()
export class ArticleComment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int' })
  articleId: number;
  @Column({ type: 'int' })
  userId: number;
  @Column({ type: 'int', nullable: true })
  parentId: number;
  @Column({ type: 'varchar', length: 255 })
  comment: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Article, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  article: Article;
  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;
  @ManyToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent?: ArticleComment;
}
