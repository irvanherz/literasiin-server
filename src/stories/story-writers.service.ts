import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { StoryWriterFilterDto } from './dto/story-writer-filter.dto';
import { StoryWriter } from './entities/story-writer';
@Injectable()
export class StoryWritersService {
  constructor(
    @InjectRepository(StoryWriter)
    private writersRepo: Repository<StoryWriter>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(payload: Partial<StoryWriter>) {
    const writer = this.writersRepo.create(payload);
    return await this.writersRepo.save(writer);
  }

  async findMany(filter: StoryWriterFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    let query = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.photo', 'photo')
      .leftJoinAndMapOne('user.meta', 'story_writer', 'sw', 'sw.userId=user.id')
      .leftJoin('story', 's', 's.id=sw.storyId');

    if (filter.storyId)
      query = query.andWhere('sw.storyId=:storyId', {
        storyId: filter.storyId,
      });
    if (filter.userId)
      query = query.andWhere('sw.userId=:userId', { userId: filter.userId });

    const result = query.skip(skip).take(take).getManyAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.writersRepo.findOne({ where: { id } });
    return result;
  }

  async deleteById(id: number) {
    const result = await this.writersRepo.delete(id);
    return result.affected;
  }
}
