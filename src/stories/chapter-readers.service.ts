import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChapterMeta } from './entities/chapter-meta.entity';
import { ChapterReader } from './entities/chapter-reader.entity';
import { Chapter } from './entities/chapter.entity';
import { StoryMeta } from './entities/story-meta.entity';
@Injectable()
export class ChapterReadersService {
  constructor(
    @InjectRepository(ChapterReader)
    private readersRepo: Repository<ChapterReader>,
    @InjectRepository(ChapterMeta)
    private chapterMetaRepo: Repository<ChapterMeta>,
    @InjectRepository(StoryMeta)
    private storyMetaRepo: Repository<StoryMeta>,
  ) {}

  // async track(chapterId: number, userId: number) {
  //   if (userId) {
  //     await this.readersRepo
  //       .createQueryBuilder('chapter_reader')
  //       .insert()
  //       .values({ chapterId, userId, updatedAt: new Date() })
  //       .orUpdate(['updatedAt'], ['chapterId', 'userId'])
  //       .execute();
  //   }
  //   return true;
  // }

  async track(chapter: Chapter, userId: number) {
    userId = userId || 0;
    const chapterId = chapter.id;

    let audience = await this.readersRepo.findOne({
      where: { chapterId, userId },
    });
    if (!audience) {
      audience = this.readersRepo.create({
        chapterId,
        userId,
        numReads: 0,
      });
    }
    audience.numReads += 1;
    await this.readersRepo.save(audience);
    return true;
  }

  async vote(chapterId: number, userId: number, vote: boolean) {
    await this.readersRepo
      .createQueryBuilder('chapter_reader')
      .insert()
      .values({ chapterId, userId, vote })
      .orUpdate(['vote'], ['chapterId', 'userId'])
      .execute();
    return true;
  }
}
