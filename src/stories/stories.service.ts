import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryFiltersDto } from './dto/story-filters.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryMeta } from './entities/story-meta.entity';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepo: Repository<Story>,
    @InjectRepository(StoryMeta)
    private storyMetaRepo: Repository<StoryMeta>,
  ) {}

  async create(payload: CreateStoryDto) {
    const story = await this.storiesRepo.save(payload);
    const meta = new StoryMeta();
    meta.story = story;
    await this.storyMetaRepo.save(meta);
    return story;
  }

  async findMany(filters: StoryFiltersDto) {
    const take = filters.limit;
    const skip = (filters.page - 1) * take;
    const result = await this.storiesRepo.findAndCount({
      where: {
        title: filters.search ? ILike(`%${filters.search}%`) : undefined,
        userId: filters.userId || undefined,
        status: filters.status || undefined,
      },
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
      relations: { category: true, user: true, cover: true },
      select: {
        category: { id: true, name: true },
        user: { id: true, fullName: true },
      },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.storiesRepo.findOne({
      where: { id },
      relations: { category: true, user: true, cover: true },
      select: {
        category: { id: true, name: true },
        user: { id: true, fullName: true },
      },
    });
    return result;
  }

  async updateById(id: number, updateStoryDto: UpdateStoryDto) {
    const result = await this.storiesRepo.update(id, updateStoryDto);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.storiesRepo.delete(id);
    return result.affected;
  }

  async incrementNumViews(storyId: number) {
    const result = await this.storyMetaRepo.increment(
      { storyId },
      'numViews',
      1,
    );
    return result.affected;
  }
}
