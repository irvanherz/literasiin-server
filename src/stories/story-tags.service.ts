import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { StoryTagFilterDto } from './dto/story-tag-filter.dto';
import { StoryTag } from './entities/story-tag.entity';

@Injectable()
export class StoryTagsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(StoryTag)
    private tagsRepository: Repository<StoryTag>,
  ) {}

  async create(payload: Partial<StoryTag>) {
    const tag = this.tagsRepository.create(payload);
    return await this.tagsRepository.save(tag);
  }

  async findMany(filter: StoryTagFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = await this.tagsRepository.findAndCount({
      where: {
        name: filter?.search ? ILike(`${filter.search}%`) : undefined,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.tagsRepository.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, payload: Partial<StoryTag>) {
    const result = await this.tagsRepository.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.tagsRepository.delete(id);
    return result.affected;
  }
}
