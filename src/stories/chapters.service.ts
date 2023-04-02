import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import {
  ChapterFilterDto,
  FindChapterByIdOptions,
} from './dto/chapter-filter.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChapterMeta } from './entities/chapter-meta.entity';
import { ChapterReader } from './entities/chapter-reader.entity';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chaptersRepo: Repository<Chapter>,
    @InjectRepository(ChapterMeta)
    private readonly chapterMetaRepo: Repository<ChapterMeta>,
    @InjectRepository(ChapterReader)
    private readonly readersRepo: Repository<ChapterReader>,
    private readonly dataSource: DataSource,
  ) {}

  async create(payload: CreateChapterDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const chapterPayload = queryRunner.manager.create<Chapter>(
        Chapter,
        payload,
      );
      const chapter = await queryRunner.manager.save(chapterPayload);
      const metaPayload = queryRunner.manager.create(ChapterMeta, {
        chapterId: chapter.id,
      });
      await queryRunner.manager.save(metaPayload);
      await queryRunner.commitTransaction();
      return chapter;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
      relations: { story: includeStory ? true : undefined },
    });
    return result;
  }

  async findContextById(id: number, userId: number) {
    const read = userId
      ? await this.readersRepo.findOne({ where: { chapterId: id, userId } })
      : undefined;
    const vote = read?.vote || 0;
    const currentChapter = await this.chaptersRepo.findOne({ where: { id } });
    const prevChapter = await this.chaptersRepo.findOne({
      where: {
        id: LessThan(id),
        storyId: currentChapter.storyId,
        status: 'published',
      },
    });
    const nextChapter = await this.chaptersRepo.findOne({
      where: {
        id: MoreThan(id),
        storyId: currentChapter.storyId,
        status: 'published',
      },
    });
    return {
      vote,
      prevChapter,
      nextChapter,
    };
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

  async incrementNumVotes(chapterId: number) {
    const result = await this.chapterMetaRepo.increment(
      { chapterId },
      'numVotes',
      1,
    );
    return result.affected;
  }

  async decrementNumVotes(chapterId: number) {
    const result = await this.chapterMetaRepo.increment(
      { chapterId },
      'numVotes',
      -1,
    );
    return result.affected;
  }

  // async trackViewById(chapterId: number) {
  //   const result = await this.chapterMetaRepo.increment(
  //     { chapterId },
  //     'numViews',
  //     1,
  //   );
  //   return result.affected;
  // }
}
