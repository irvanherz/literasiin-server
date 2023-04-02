import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  ValueTransformer,
  VirtualColumn,
} from 'typeorm';
import { Article } from './article.entity';

export const NumberTransformer: ValueTransformer = {
  to: (entityValue: string) => entityValue,
  from: (databaseValue: string) => +databaseValue,
};

@Entity()
export class ArticleMeta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  articleId: number;
  @Column({ type: 'int', default: 0 })
  numViews: number;
  @OneToOne(() => Article, (article) => article.meta, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  article: Article;

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(*) FROM article_reader ar WHERE ar."articleId"=${alias}."articleId" AND ar.bookmark=true`,
    transformer: NumberTransformer,
  })
  numBookmarks: number;
  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(*) FROM article_reader ar WHERE ar."articleId"=${alias}."articleId" AND ar.vote=1`,
    transformer: NumberTransformer,
  })
  numUpvotes: number;
  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT(*) FROM article_reader ar WHERE ar."articleId"=${alias}."articleId" AND ar.vote=-1`,
    transformer: NumberTransformer,
  })
  numDownvotes: number;
}
