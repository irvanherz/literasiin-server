import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StorytellingFilter } from './dto/storytellings.dto';
import { StorytellingAudience } from './entities/storytelling-audience.entity';
import { StorytellingAuthor } from './entities/storytelling-author.entity';
import { StorytellingMeta } from './entities/storytelling-meta.entity';
import { Storytelling } from './entities/storytelling.entity';

@Injectable()
export class StorytellingsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Storytelling)
    private storytellingsRepo: Repository<Storytelling>,
    @InjectRepository(StorytellingMeta)
    private metaRepo: Repository<StorytellingMeta>,
    @InjectRepository(StorytellingAudience)
    private readonly audiencesRepo: Repository<StorytellingAudience>,
  ) {}

  async create(payload: Partial<Storytelling>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const storytellingPayload = queryRunner.manager.create(
        Storytelling,
        payload,
      );
      const storytelling = await queryRunner.manager.save(storytellingPayload);
      const authorPayload = queryRunner.manager.create(StorytellingAuthor, {
        storytellingId: storytelling.id,
        userId: payload.userId,
        role: 'owner',
        status: 'approved',
      });
      const metaPayload = queryRunner.manager.create(StorytellingMeta, {
        storytellingId: storytelling.id,
      });
      await queryRunner.manager.save(metaPayload);
      await queryRunner.manager.save(authorPayload);
      await queryRunner.commitTransaction();
      return storytelling;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findMany(filter: StorytellingFilter) {
    const take = filter.limit;
    const skip = (filter.page - 1) * take;

    let query = await this.storytellingsRepo
      .createQueryBuilder('storytelling')
      .leftJoinAndSelect('storytelling.cover', 'media')
      .leftJoinAndSelect('storytelling.meta', 'storytelling_meta')
      .leftJoinAndSelect('storytelling.category', 'storytelling_category')
      .leftJoin(
        'storytelling_author',
        'sw',
        "sw.storytellingId=storytelling.id AND sw.status='approved'",
      )
      .leftJoinAndSelect('storytelling.authors', 'user', 'user.id=sw.userId')
      .leftJoinAndSelect('user.photo', 'up');

    if (filter.bookmarkedByUserId) {
      query = query.innerJoinAndMapOne(
        'storytelling.audience',
        'storytelling_audience',
        'audience',
        'audience.storytellingId=storytelling.id AND audience.userId=:userId AND audience.bookmark=true',
        { userId: filter.bookmarkedByUserId },
      );
    }
    query = query.orderBy(
      filter.sortBy.includes('.')
        ? filter.sortBy
        : `storytelling.${filter.sortBy}`,
      filter.sortOrder.toUpperCase() as any,
    );
    if (filter.search) {
      query = query.andWhere('storytelling.title like :search', {
        title: `%${filter.search}%`,
      });
    }
    if (filter.userId) {
      query = query.andWhere(
        `(SELECT COUNT(*) FROM storytelling_author sw2 WHERE sw2."storytellingId"=storytelling.id AND sw2."userId"=:userId AND sw2.status='approved')=1`,
        {
          userId: filter.userId,
        },
      );
    }
    if (filter.status) {
      query = query.andWhere('storytelling.status=:status', {
        status: filter.status,
      });
    }
    if (filter.categoryId) {
      query = query.andWhere('storytelling.categoryId=:categoryId', {
        categoryId: filter.categoryId,
      });
    }

    const result = query.skip(skip).take(take).getManyAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.storytellingsRepo
      .createQueryBuilder('storytelling')
      .leftJoinAndSelect('storytelling.cover', 'media')
      .leftJoinAndSelect('storytelling.meta', 'storytelling_meta')
      .leftJoinAndSelect('storytelling.category', 'storytelling_category')
      .leftJoin(
        'storytelling_author',
        'sw',
        "sw.storytellingId=storytelling.id AND sw.status='approved'",
      )
      .leftJoinAndSelect('storytelling.authors', 'user', 'user.id=sw.userId')
      .leftJoinAndSelect('user.photo', 'up')
      .where('storytelling.id=:id', { id })
      .getOne();
    return result;
  }

  async findContextById(storytellingId: number, userId?: number) {
    let hasBookmarked = false;
    if (userId) {
      const reader = await this.audiencesRepo.findOne({
        where: { storytellingId, userId },
      });
      hasBookmarked = reader?.bookmark || false;
    }
    return {
      hasBookmarked,
    };
  }

  async updateById(id: number, payload: Partial<Storytelling>) {
    const result = await this.storytellingsRepo.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.storytellingsRepo.delete(id);
    return result.affected;
  }

  async incrementNumViews(storytellingId: number) {
    const result = await this.metaRepo.increment(
      { storytellingId },
      'numViews',
      1,
    );
    return result.affected;
  }

  async incrementNumVotes(storytellingId: number) {
    const result = await this.metaRepo.increment(
      { storytellingId },
      'numVotes',
      1,
    );
    return result.affected;
  }

  async decrementNumVotes(storytellingId: number) {
    const result = await this.metaRepo.increment(
      { storytellingId },
      'numVotes',
      -1,
    );
    return result.affected;
  }

  // async assignTag(storytellingId: number, name: string) {
  //   let tag = null;
  //   tag = await this.storytellingTagsRepo.findOne({ where: { name } });
  //   if (!tag) {
  //     const setData = { name };
  //     tag = await this.storytellingTagsRepo.save(setData);
  //   }
  //   const tagId = tag.id;
  //   return await this.storytellingTagMapRepo.save({ storytellingId, tagId });
  // }

  // async unassignTag(storytellingId: number, name: string) {
  //   const tag = await this.storytellingTagsRepo.findOne({ where: { name } });
  //   const tagId = tag.id;
  //   const result = await this.storytellingTagMapRepo.delete({
  //     storytellingId,
  //     tagId,
  //   });
  //   return result.affected;
  // }
}
