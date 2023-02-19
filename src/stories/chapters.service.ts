import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChapterFiltersDto,
  FindChapterByIdOptions,
} from './dto/chapter-filters.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chaptersRepository: Repository<Chapter>,
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    const chapter = this.chaptersRepository.create(createChapterDto);
    return await this.chaptersRepository.save(chapter);
  }

  async findMany(filters: ChapterFiltersDto) {
    const take = filters.limit;
    const skip = (filters.page - 1) * take;
    const result = await this.chaptersRepository.findAndCount({
      where: {
        storyId: filters.storyId ? filters.storyId : undefined,
      },
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
    });
    return result;
  }

  async findById(id: number, options: FindChapterByIdOptions = {}) {
    const { includeStory } = options;
    console.log(includeStory);

    const result = await this.chaptersRepository.findOne({
      where: { id },
      relations: { story: includeStory ? { user: true } : undefined },
    });
    return result;
  }

  async updateById(id: number, updateChapterDto: UpdateChapterDto) {
    const result = await this.chaptersRepository.update(id, updateChapterDto);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.chaptersRepository.delete(id);
    return result.affected;
  }
}
