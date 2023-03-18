import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ArticleFilterDto } from './dto/article-filter.dto';
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
}
