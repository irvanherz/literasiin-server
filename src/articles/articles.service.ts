import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleFiltersDto } from './dto/article-filters.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articlesRepository.create(createArticleDto);
    return await this.articlesRepository.save(article);
  }

  async findMany(filters: ArticleFiltersDto) {
    const take = filters.limit;
    const skip = (filters.page - 1) * take;
    const result = await this.articlesRepository.findAndCount({
      where: {
        userId: filters.userId || undefined,
        categoryId: filters.categoryId || undefined,
      },
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.articlesRepository.findOne({ where: { id } });
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
}
