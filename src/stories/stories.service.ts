import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StoryFilterDto } from './dto/story-filter.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
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

  async findMany(filters: StoryFilterDto) {
    const take = filters.limit;
    const skip = (filters.page - 1) * take;

    let query = await this.storiesRepo
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.cover', 'media')
      .leftJoinAndSelect('story.meta', 'story_meta')
      .leftJoinAndSelect('story.category', 'story_category')
      .leftJoinAndSelect('story.tags', 'story_tag')
      .leftJoin(
        'story_writer',
        'sw',
        "sw.storyId=story.id AND sw.status='approved'",
      )
      .leftJoinAndSelect('story.writers', 'user', 'user.id=sw.userId')
      .leftJoinAndSelect('user.photo', 'up');

    if (filters.bookmarkedByUserId) {
      query = query.innerJoinAndMapOne(
        'story.reader',
        'story_reader',
        'reader',
        'reader.storyId=story.id AND reader.userId=:userId AND reader.bookmark=true',
        { userId: filters.bookmarkedByUserId },
      );
    }
    query = query.orderBy(
      filters.sortBy.includes('.') ? filters.sortBy : `story.${filters.sortBy}`,
      filters.sortOrder.toUpperCase() as any,
    );
    if (filters.search) {
      query = query.andWhere('story.title like :search', {
        title: `%${filters.search}%`,
      });
    }
    if (filters.userId) {
      query = query.andWhere(
        `(SELECT COUNT(*) FROM story_writer sw2 WHERE sw2."storyId"=story.id AND sw2."userId"=:userId AND sw2.status='approved')=1`,
        {
          userId: filters.userId,
        },
      );
    }
    if (filters.status) {
      query = query.andWhere('story.status=:status', {
        status: filters.status,
      });
    }
    if (filters.categoryId) {
      query = query.andWhere('story.categoryId=:categoryId', {
        categoryId: filters.categoryId,
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
      .leftJoinAndSelect('story.tags', 'story_tag')
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

  async incrementNumViews(storyId: number) {
    const result = await this.storyMetaRepo.increment(
      { storyId },
      'numViews',
      1,
    );
    return result.affected;
  }

  async incrementNumVotes(storyId: number) {
    const result = await this.storyMetaRepo.increment(
      { storyId },
      'numVotes',
      1,
    );
    return result.affected;
  }

  async decrementNumVotes(storyId: number) {
    const result = await this.storyMetaRepo.increment(
      { storyId },
      'numVotes',
      -1,
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
