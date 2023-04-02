import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategoriesController } from './article-categories.controller';
import { ArticleCategoriesService } from './article-categories.service';
import { ArticleReadersController } from './article-readers.controller';
import { ArticleReadersService } from './article-readers.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleCategory } from './entities/article-category.entity';
import { ArticleMeta } from './entities/article-meta.entity';
import { ArticleReader } from './entities/article-reader.entity';
import { Article } from './entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      ArticleCategory,
      ArticleReader,
      ArticleMeta,
    ]),
  ],
  controllers: [
    ArticleCategoriesController,
    ArticleReadersController,
    ArticlesController,
  ],
  providers: [ArticleCategoriesService, ArticlesService, ArticleReadersService],
})
export class ArticlesModule {}
