import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryMeta } from './entities/story-meta.entity';
import { StoryReader } from './entities/story-reader.entity';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryReadersService {
  constructor(
    @InjectRepository(StoryReader)
    private readersRepo: Repository<StoryReader>,
    @InjectRepository(StoryMeta)
    private storyMetaRepo: Repository<StoryMeta>,
  ) {}

  // async track(storyId: number, userId: number) {
  //   let reader = await this.readersRepo.findOne({ where: { storyId, userId } });
  //   if (!reader) {
  //     reader = await this.readersRepo.save({ storyId, userId });
  //   }
  //   // await this.storyMetaRepo.increment({ storyId }, 'numViews', 1);
  //   return reader;
  // }

  async track(story: Story, userId: number) {
    userId = userId || 0;
    const storyId = story.id;

    let audience = await this.readersRepo.findOne({
      where: { storyId, userId },
    });
    if (!audience) {
      audience = this.readersRepo.create({
        storyId,
        userId,
        numViews: 0,
      });
    }
    audience.numViews += 1;
    await this.readersRepo.save(audience);
    return true;
  }
  async setBookmark(storyId: number, userId: number, bookmark: boolean) {
    let reader = await this.readersRepo.findOne({ where: { storyId, userId } });
    if (!reader) {
      reader = await this.readersRepo.save({ storyId, userId, bookmark });
    } else {
      reader.bookmark = bookmark;
      reader = await this.readersRepo.save(reader);
    }
    return reader;
  }
}
