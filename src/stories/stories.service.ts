import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
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

  async findMany() {
    const result = await this.storiesRepository.findAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.storiesRepository.findOne({ where: { id } });
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
