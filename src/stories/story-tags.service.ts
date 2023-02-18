import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { StoryTag } from './entities/story-tag.entity';

@Injectable()
export class StoryTagsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(StoryTag)
    private tagsRepository: Repository<StoryTag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  async findMany() {
    const result = await this.tagsRepository.findAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.tagsRepository.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, updateTagDto: UpdateTagDto) {
    const result = await this.tagsRepository.update(id, updateTagDto);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.tagsRepository.delete(id);
    return result.affected;
  }
}
