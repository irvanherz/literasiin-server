import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleMeta } from './entities/article-meta.entity';
import { ArticleReader } from './entities/article-reader.entity';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articlesRepository: Repository<Article>,
    @InjectRepository(ArticleReader)
    private readonly readersRepo: Repository<ArticleReader>,
    private readonly dataSource: DataSource,
  ) {}

  async create(payload: CreateArticleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const articleP = queryRunner.manager.create<Article>(Article, payload);
      const article = await queryRunner.manager.save(articleP);
      const metaP = queryRunner.manager.create(ArticleMeta, {
        articleId: article.id,
      });
      await queryRunner.manager.save(metaP);
      await queryRunner.commitTransaction();
      return article;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findMany(filter: ArticleFilterDto) {
    const take = filter.limit;
    const skip = (filter.page - 1) * take;

    let query = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.image', 'media')
      .leftJoinAndSelect('article.meta', 'article_meta')
      .leftJoinAndSelect('article.category', 'article_category')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('user.photo', 'up');

    if (filter.bookmarkedByUserId) {
      query = query.innerJoinAndMapOne(
        'article.reader',
        'article_reader',
        'reader',
        'reader.articleId=article.id AND reader.userId=:userId AND reader.bookmark=true',
        { userId: filter.bookmarkedByUserId },
      );
    }
    query = query.orderBy(
      filter.sortBy.includes('.') ? filter.sortBy : `article.${filter.sortBy}`,
      filter.sortOrder.toUpperCase() as any,
    );
    if (filter.search) {
      query = query.andWhere('article.title ilike :search', {
        search: `%${filter.search}%`,
      });
    }
    if (filter.userId) {
      query = query.andWhere('article.userId=:userId', {
        userId: filter.userId,
      });
    }
    if (filter.status) {
      query = query.andWhere('article.status=:status', {
        status: filter.status,
      });
    }
    if (filter.categoryId) {
      query = query.andWhere('article.categoryId=:categoryId', {
        categoryId: filter.categoryId,
      });
    }

    const result = query.skip(skip).take(take).getManyAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.articlesRepository.findOne({
      where: { id },
      relations: { image: true },
    });
    return result;
  }

  async updateById(id: number, updateArticleDto: UpdateArticleDto) {
    const result = await this.articlesRepository.update(id, updateArticleDto);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.articlesRepository.delete(id);
    return result.affected;
  }

  async findContextById(articleId: number, userId?: number) {
    let hasBookmarked = false;
    let vote = 0;
    if (userId) {
      const reader = await this.readersRepo.findOne({
        where: { articleId, userId },
      });
      hasBookmarked = reader?.bookmark || false;
      vote = reader?.vote || 0;
    }
    return {
      hasBookmarked,
      vote,
    };
  }
}
