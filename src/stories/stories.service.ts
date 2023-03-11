import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryFiltersDto } from './dto/story-filters.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryMeta } from './entities/story-meta.entity';
import { StoryTagMap } from './entities/story-tag-map.entity';
import { StoryTag } from './entities/story-tag.entity';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepo: Repository<Story>,
    @InjectRepository(StoryMeta)
    private storyMetaRepo: Repository<StoryMeta>,
    @InjectRepository(StoryTag)
    private storyTagsRepo: Repository<StoryTag>,
    @InjectRepository(StoryTagMap)
    private storyTagMapRepo: Repository<StoryTagMap>,
  ) {}

  async create(payload: CreateStoryDto) {
    const story = await this.storiesRepo.save(payload as any);
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

  async updateById(id: number, payload: UpdateStoryDto) {
    const result = await this.storiesRepo.update(id, payload);
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

  async assignTag(storyId: number, name: string) {
    let tag = null;
    tag = await this.storyTagsRepo.findOne({ where: { name } });
    if (!tag) {
      const setData = { name };
      tag = await this.storyTagsRepo.save(setData);
    }
    const tagId = tag.id;
    return await this.storyTagMapRepo.save({ storyId, tagId });
  }

  async unassignTag(storyId: number, name: string) {
    const tag = await this.storyTagsRepo.findOne({ where: { name } });
    const tagId = tag.id;
    const result = await this.storyTagMapRepo.delete({
      storyId,
      tagId,
    });
    return result.affected;
  }
}
