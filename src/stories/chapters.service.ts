import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChapterFilterDto,
  FindChapterByIdOptions,
} from './dto/chapter-filter.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterMeta } from './entities/chapter-meta.entity';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chaptersRepo: Repository<Chapter>,
    @InjectRepository(ChapterMeta)
    private chapterMetaRepo: Repository<ChapterMeta>,
  ) {}

  async create(payload: CreateChapterDto) {
    const chapter = this.chaptersRepo.create(payload);
    const result = await this.chaptersRepo.save(chapter);
    const meta = new ChapterMeta();
    meta.chapter = chapter;
    await this.chapterMetaRepo.save(meta);
    return result;
  }

  async findMany(filter: ChapterFilterDto) {
    const take = filter.limit;
    const skip = (filter.page - 1) * take;
    const result = await this.chaptersRepo.findAndCount({
      where: {
        storyId: filter.storyId ? filter.storyId : undefined,
        status: (filter.status || undefined) as any,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number, options: FindChapterByIdOptions = {}) {
    const { includeStory } = options;
    console.log(includeStory);

    const result = await this.chaptersRepo.findOne({
      where: { id },
      relations: { story: includeStory ? { user: true } : undefined },
    });
    return result;
  }

  async updateById(id: number, updateChapterDto: UpdateChapterDto) {
    const result = await this.chaptersRepo.update(id, updateChapterDto);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.chaptersRepo.delete(id);
    return result.affected;
  }

  async incrementNumViews(chapterId: number) {
    const result = await this.chapterMetaRepo.increment(
      { chapterId },
      'numViews',
      1,
    );
    return result.affected;
  }
}
