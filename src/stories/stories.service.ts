import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryFiltersDto } from './dto/story-filters.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  async create(createStoryDto: CreateStoryDto) {
    const story = this.storiesRepository.create(createStoryDto);
    return await this.storiesRepository.save(story);
  }

  async findMany(filters: StoryFiltersDto) {
    const take = filters.limit;
    const skip = (filters.page - 1) * take;
    const result = await this.storiesRepository.findAndCount({
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
    const result = await this.storiesRepository.findOne({
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
    const result = await this.storiesRepository.update(id, updateStoryDto);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.storiesRepository.delete(id);
    return result.affected;
  }
}
