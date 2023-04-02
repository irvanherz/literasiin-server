import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
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
    const result = await this.articlesRepository.findAndCount({
      where: {
        title: filter.search ? ILike(`%${filter.search}%`) : undefined,
        status: (filter.status || undefined) as any,
        userId: filter.userId || undefined,
        categoryId: filter.categoryId || undefined,
      },
      relations: { image: true },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
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
