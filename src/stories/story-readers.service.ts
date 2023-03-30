import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { StoryReader } from './entities/story-reader';

@Injectable()
export class StoryReadersService {
  constructor(
    @InjectRepository(StoryReader)
    private readersRepo: Repository<StoryReader>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async track(storyId: number, userId: number) {
    let reader = await this.readersRepo.findOne({ where: { storyId, userId } });
    if (!reader) {
      reader = await this.readersRepo.save({ storyId, userId });
    }
    return reader;
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
