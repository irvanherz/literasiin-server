import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  ArticleCommentFilterDto,
  UpdateArticleCommentDto,
} from './dto/article-comments.dto';
import { ArticleComment } from './entities/article-comment.entity';

@Injectable()
export class ArticleCommentsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(ArticleComment)
    private commentsRepository: Repository<ArticleComment>,
  ) {}

  async create(payload: Partial<ArticleComment>) {
    const comment = this.commentsRepository.create(payload);
    return await this.commentsRepository.save(comment);
  }

  async findMany(filter: ArticleCommentFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = await this.commentsRepository.findAndCount({
      where: {
        articleId: filter?.articleId || undefined,
        parentId: filter?.parentId || null,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.commentsRepository.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, payload: UpdateArticleCommentDto) {
    const result = await this.commentsRepository.update(id, payload);
    return result.affected;
  }
  async deleteById(id: number) {
    const result = await this.commentsRepository.delete(id);
    return result.affected;
  }
}
