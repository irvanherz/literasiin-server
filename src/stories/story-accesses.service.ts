import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { StoryAccess } from './entities/story-access';

@Injectable()
export class StoryAccessesService {
  constructor(
    @InjectRepository(StoryAccess)
    private accessesRepo: Repository<StoryAccess>,
  ) {}

  async create(payload: Partial<StoryAccess>) {
    const result = await this.accessesRepo.save(payload);
    return result;
  }

  async findByChapterAndUserId(chapter: Chapter, userId: number) {
    const storyId = chapter.storyId;
    const chapterId = chapter.id;
    const result = await this.accessesRepo.findOne({
      where: [
        { storyId, chapterId: 0, userId },
        { storyId, chapterId, userId },
      ],
    });
    return result;
  }
}
