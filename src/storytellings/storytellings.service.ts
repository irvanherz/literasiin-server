import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StorytellingFilter } from './dto/storytellings.dto';
import { StorytellingAudience } from './entities/storytelling-audience.entity';
import { StorytellingAuthor } from './entities/storytelling-author.entity';
import { StorytellingEpisodeAudience } from './entities/storytelling-episode-audience.entity';
import { StorytellingEpisode } from './entities/storytelling-episode.entity';
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
    @InjectRepository(StorytellingEpisode)
    private episodesRepo: Repository<StorytellingEpisode>,
    @InjectRepository(StorytellingEpisodeAudience)
    private episodeAudiencesRepo: Repository<StorytellingEpisodeAudience>,
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

  async updateById(id: number, payload: Partial<Storytelling>) {
    const result = await this.storytellingsRepo.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.storytellingsRepo.delete(id);
    return result.affected;
  }

  async updateNumViews(storytellingId: number) {
    const numViews = await this.audiencesRepo.sum('numViews', {
      storytellingId,
    });
    await this.metaRepo.update({ storytellingId }, { numViews });
  }

  async updateNumListeners(storytellingId: number) {
    const data = await this.episodesRepo
      .createQueryBuilder('episode')
      .leftJoin(
        StorytellingEpisodeAudience,
        'audience',
        'episode.id=audience.episodeId',
      )
      .groupBy('episode.storytellingId')
      .where('episode.storytellingId=:storytellingId', { storytellingId })
      .select('SUM(audience.numListens)', 'numListens')
      .addSelect('COUNT(DISTINCT audience.userId)', 'numListeners')
      .getRawOne();

    const numListens = data?.numListens || 0;
    const numListeners = data?.numListeners || 0;
    await this.metaRepo.update(
      { storytellingId },
      { numListens, numListeners },
    );
  }

  async updateNumVotes(storytellingId: number) {
    const data = await this.episodesRepo
      .createQueryBuilder('episode')
      .leftJoin(
        StorytellingEpisodeAudience,
        'audience',
        'episode.id=audience.episodeId',
      )
      .groupBy('episode.storytellingId')
      .where('episode.storytellingId=:storytellingId AND audience.vote=true', {
        storytellingId,
      })
      .select('COUNT(audience.id)', 'numVotes')
      .getRawOne();

    const numVotes = data?.numVotes || 0;
    await this.metaRepo.update({ storytellingId }, { numVotes });
  }

  async updateNumEpisodes(storytellingId: number) {
    const numEpisodes = await this.episodesRepo.count({
      where: { storytellingId },
    });
    const numPublishedEpisodes = await this.episodesRepo.count({
      where: { storytellingId, status: 'published' },
    });
    await this.metaRepo.update(
      { storytellingId },
      { numEpisodes, numPublishedEpisodes },
    );
    if (!numPublishedEpisodes) {
      await this.storytellingsRepo.update(storytellingId, { status: 'draft' });
    }
  }
}
