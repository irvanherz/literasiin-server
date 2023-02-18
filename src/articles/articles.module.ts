import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategoriesController } from './article-categories.controller';
import { ArticleCategoriesService } from './article-categories.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleCategory } from './entities/article-category.entity';
import { Article } from './entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleCategory])],
  controllers: [ArticleCategoriesController, ArticlesController],
  providers: [ArticleCategoriesService, ArticlesService],
})
export class ArticlesModule {}
