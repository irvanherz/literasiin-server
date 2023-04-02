import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleMeta } from './entities/article-meta.entity';
import { ArticleReader } from './entities/article-reader.entity';

@Injectable()
export class ArticleReadersService {
  constructor(
    @InjectRepository(ArticleReader)
    private readonly readersRepo: Repository<ArticleReader>,
    @InjectRepository(ArticleMeta)
    private readonly articleMetaRepo: Repository<ArticleMeta>,
  ) {}

  async track(articleId: number, userId: number) {
    let reader = await this.readersRepo.findOne({
      where: { articleId, userId },
    });
    if (!reader) {
      reader = await this.readersRepo.save({ articleId, userId });
    }
    await this.articleMetaRepo.increment({ articleId }, 'numViews', 1);
    return reader;
  }

  async setBookmark(articleId: number, userId: number, bookmark: boolean) {
    let reader = await this.readersRepo.findOne({
      where: { articleId, userId },
    });
    if (!reader) {
      reader = await this.readersRepo.save({ articleId, userId, bookmark });
    } else {
      reader.bookmark = bookmark;
      reader = await this.readersRepo.save(reader);
    }
    return reader;
  }

  async setVote(articleId: number, userId: number, vote: number) {
    let reader = await this.readersRepo.findOne({
      where: { articleId, userId },
    });
    if (!reader) {
      reader = await this.readersRepo.save({ articleId, userId, vote });
    } else {
      reader.vote = vote;
      reader = await this.readersRepo.save(reader);
    }
    return reader;
  }
}
