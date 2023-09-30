import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StoryFilterDto, UpdateStoryDto } from './dto/stories.dto';
import { ChapterReader } from './entities/chapter-reader.entity';
import { Chapter } from './entities/chapter.entity';
import { StoryMeta } from './entities/story-meta.entity';
import { StoryReader } from './entities/story-reader.entity';
import { StoryTagMap } from './entities/story-tag-map.entity';
import { StoryTag } from './entities/story-tag.entity';
import { StoryWriter } from './entities/story-writer';
import { Story } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Story)
    private storiesRepo: Repository<Story>,
    @InjectRepository(Chapter)
    private chaptersRepo: Repository<Chapter>,
    @InjectRepository(StoryMeta)
    private storyMetaRepo: Repository<StoryMeta>,
    @InjectRepository(StoryTag)
    private storyTagsRepo: Repository<StoryTag>,
    @InjectRepository(StoryTagMap)
    private storyTagMapRepo: Repository<StoryTagMap>,
    @InjectRepository(StoryReader)
    private readonly readersRepo: Repository<StoryReader>,
  ) {}

  async create(payload: Partial<Story>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const storyPayload = queryRunner.manager.create(Story, payload);
      const story = await queryRunner.manager.save(storyPayload);
      const writerPayload = queryRunner.manager.create(StoryWriter, {
        storyId: story.id,
        userId: payload.userId,
        role: 'owner',
        status: 'approved',
      });
      const metaPayload = queryRunner.manager.create(StoryMeta, {
        storyId: story.id,
      });
      await queryRunner.manager.save(metaPayload);
      await queryRunner.manager.save(writerPayload);
      await queryRunner.commitTransaction();
      return story;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findMany(filter: StoryFilterDto) {
    const take = filter.limit;
    const skip = (filter.page - 1) * take;

    let query = await this.storiesRepo
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.cover', 'media')
      .leftJoinAndSelect('story.meta', 'story_meta')
      .leftJoinAndSelect('story.category', 'story_category')
      .leftJoin(
        'story_writer',
        'sw',
        "sw.storyId=story.id AND sw.status='approved'",
      )
      .leftJoinAndSelect('story.writers', 'user', 'user.id=sw.userId')
      .leftJoinAndSelect('user.photo', 'up');

    if (filter.bookmarkedByUserId) {
      query = query.innerJoinAndMapOne(
        'story.reader',
        'story_reader',
        'reader',
        'reader.storyId=story.id AND reader.userId=:userId AND reader.bookmark=true',
        { userId: filter.bookmarkedByUserId },
      );
    }
    query = query.orderBy(
      filter.sortBy.includes('.') ? filter.sortBy : `story.${filter.sortBy}`,
      filter.sortOrder.toUpperCase() as any,
    );
    if (filter.search) {
      query = query.andWhere('story.title ilike :search', {
        search: `%${filter.search}%`,
      });
    }
    if (filter.userId) {
      query = query.andWhere(
        `(SELECT COUNT(*) FROM story_writer sw2 WHERE sw2."storyId"=story.id AND sw2."userId"=:userId AND sw2.status='approved')=1`,
        {
          userId: filter.userId,
        },
      );
    }
    if (filter.status) {
      query = query.andWhere('story.status=:status', {
        status: filter.status,
      });
    }
    if (filter.categoryId) {
      query = query.andWhere('story.categoryId=:categoryId', {
        categoryId: filter.categoryId,
      });
    }

    const result = query.skip(skip).take(take).getManyAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.storiesRepo
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.cover', 'media')
      .leftJoinAndSelect('story.meta', 'story_meta')
      .leftJoinAndSelect('story.category', 'story_category')
      .leftJoin(
        'story_writer',
        'sw',
        "sw.storyId=story.id AND sw.status='approved'",
      )
      .leftJoinAndSelect('story.writers', 'user', 'user.id=sw.userId')
      .leftJoinAndSelect('user.photo', 'up')
      .where('story.id=:id', { id })
      .getOne();
    return result;
  }

  async findContextById(storyId: number, userId?: number) {
    let hasBookmarked = false;
    if (userId) {
      const reader = await this.readersRepo.findOne({
        where: { storyId, userId },
      });
      hasBookmarked = reader?.bookmark || false;
    }
    return {
      hasBookmarked,
    };
  }

  async updateById(id: number, payload: UpdateStoryDto) {
    const result = await this.storiesRepo.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.storiesRepo.delete(id);
    return result.affected;
  }

  // async incrementNumViews(storyId: number) {
  //   const result = await this.storyMetaRepo.increment(
  //     { storyId },
  //     'numViews',
  //     1,
  //   );
  //   return result.affected;
  // }

  // async incrementNumVotes(storyId: number) {
  //   const result = await this.storyMetaRepo.increment(
  //     { storyId },
  //     'numVotes',
  //     1,
  //   );
  //   return result.affected;
  // }

  // async decrementNumVotes(storyId: number) {
  //   const result = await this.storyMetaRepo.increment(
  //     { storyId },
  //     'numVotes',
  //     -1,
  //   );
  //   return result.affected;
  // }

  async updateNumReads(storyId: number) {
    const data = await this.chaptersRepo
      .createQueryBuilder('chapter')
      .leftJoin(ChapterReader, 'reader', 'chapter.id=reader.chapterId')
      .groupBy('chapter.storyId')
      .where('chapter.storyId=:storyId', { storyId })
      .select('SUM(reader.numReads)', 'numReads')
      .addSelect('COUNT(DISTINCT reader.userId)', 'numReaders')
      .getRawOne();

    console.log(data);

    const numReads = data?.numReads || 0;
    const numReaders = data?.numReaders || 0;
    await this.storyMetaRepo.update({ storyId }, { numReads, numReaders });
  }

  async updateNumVotes(storyId: number) {
    const data = await this.chaptersRepo
      .createQueryBuilder('chapter')
      .leftJoin(ChapterReader, 'reader', 'chapter.id=reader.chapterId')
      .groupBy('chapter.storyId')
      .where('chapter.storyId=:storyId AND reader.vote=true', {
        storyId,
      })
      .select('COUNT(reader.id)', 'numVotes')
      .getRawOne();

    const numVotes = data?.numVotes || 0;
    await this.storyMetaRepo.update({ storyId }, { numVotes });
  }

  async updateNumViews(storyId: number) {
    const data = await this.readersRepo
      .createQueryBuilder('reader')
      .select('SUM(reader.numViews)', 'numViews')
      .addSelect('COUNT(DISTINCT reader.userId)', 'numViewers')
      .groupBy('reader.storyId')
      .where('reader.storyId=:storyId', { storyId })
      .getRawOne();

    const numViews = data?.numViews || 0;
    const numViewers = data?.numViewers || 0;
    await this.storyMetaRepo.update({ storyId }, { numViews, numViewers });
  }

  async updateNumChapters(storyId: number) {
    const numChapters = await this.chaptersRepo.count({
      where: { storyId },
    });
    const numPublishedChapters = await this.chaptersRepo.count({
      where: { storyId, status: 'published' },
    });
    await this.storyMetaRepo.update(
      { storyId },
      { numChapters, numPublishedChapters },
    );
    if (!numPublishedChapters) {
      await this.storiesRepo.update(storyId, { status: 'draft' });
    }
  }

  async updateNumBookmarks(storyId: number) {
    const numBookmarks = await this.readersRepo.count({
      where: { storyId, bookmark: true },
    });

    await this.storyMetaRepo.update({ storyId }, { numBookmarks });
  }
}
