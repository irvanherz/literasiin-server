import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  StoryCommentFilterDto,
  UpdateStoryCommentDto,
} from './dto/story-comments.dto';
import { StoryComment } from './entities/story-comment.entity';

@Injectable()
export class StoryCommentsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(StoryComment)
    private commentsRepository: Repository<StoryComment>,
  ) {}

  async create(payload: Partial<StoryComment>) {
    const comment = this.commentsRepository.create(payload);
    return await this.commentsRepository.save(comment);
  }

  async findMany(filter: StoryCommentFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = await this.commentsRepository.findAndCount({
      where: {
        storyId: filter?.storyId || undefined,
        chapterId: filter?.chapterId || undefined,
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

  async updateById(id: number, payload: UpdateStoryCommentDto) {
    const result = await this.commentsRepository.update(id, payload);
    return result.affected;
  }
  async deleteById(id: number) {
    const result = await this.commentsRepository.delete(id);
    return result.affected;
  }
}
