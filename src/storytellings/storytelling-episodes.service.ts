import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import {
  FindStorytellingEpisodeByIdOptions,
  StorytellingEpisodeFilter,
} from './dto/storytelling-episodes.dto';
import { StorytellingEpisodeAudience } from './entities/storytelling-episode-audience.entity';
import { StorytellingEpisodeMeta } from './entities/storytelling-episode-meta.entity';
import { StorytellingEpisode } from './entities/storytelling-episode.entity';

@Injectable()
export class StorytellingEpisodesService {
  constructor(
    @InjectRepository(StorytellingEpisode)
    private readonly episodesRepo: Repository<StorytellingEpisode>,
    @InjectRepository(StorytellingEpisodeMeta)
    private readonly storytellingEpisodeMetaRepo: Repository<StorytellingEpisodeMeta>,
    @InjectRepository(StorytellingEpisodeAudience)
    private readonly readersRepo: Repository<StorytellingEpisodeAudience>,
    private readonly dataSource: DataSource,
  ) {}

  async create(payload: Partial<StorytellingEpisode>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const episodePayload = queryRunner.manager.create<StorytellingEpisode>(
        StorytellingEpisode,
        payload,
      );
      const episode = await queryRunner.manager.save(episodePayload);
      const metaPayload = queryRunner.manager.create(StorytellingEpisodeMeta, {
        episodeId: episode.id,
      });
      await queryRunner.manager.save(metaPayload);
      await queryRunner.commitTransaction();
      return episode;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findMany(filter: StorytellingEpisodeFilter) {
    const take = filter.limit;
    const skip = (filter.page - 1) * take;
    const result = await this.episodesRepo.findAndCount({
      where: {
        storytellingId: filter.storytellingId
          ? filter.storytellingId
          : undefined,
        status: (filter.status || undefined) as any,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number, options: FindStorytellingEpisodeByIdOptions = {}) {
    const { includeStorytelling } = options;
    console.log(includeStorytelling);

    const result = await this.episodesRepo.findOne({
      where: { id },
      relations: { storytelling: includeStorytelling ? true : undefined },
    });
    return result;
  }

  async findContextById(id: number, userId: number) {
    const read = userId
      ? await this.readersRepo.findOne({ where: { episodeId: id, userId } })
      : undefined;
    const vote = read?.vote || 0;
    const currentEpisode = await this.episodesRepo.findOne({ where: { id } });
    const prevEpisode = await this.episodesRepo.findOne({
      where: {
        id: LessThan(id),
        storytellingId: currentEpisode.storytellingId,
        status: 'published',
      },
    });
    const nextEpisode = await this.episodesRepo.findOne({
      where: {
        id: MoreThan(id),
        storytellingId: currentEpisode.storytellingId,
        status: 'published',
      },
    });
    return {
      vote,
      prevEpisode,
      nextEpisode,
    };
  }

  async updateById(id: number, payload: Partial<StorytellingEpisode>) {
    const result = await this.episodesRepo.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.episodesRepo.delete(id);
    return result.affected;
  }

  async incrementNumViews(episodeId: number) {
    const result = await this.storytellingEpisodeMetaRepo.increment(
      { episodeId },
      'numViews',
      1,
    );
    return result.affected;
  }

  async incrementNumVotes(episodeId: number) {
    const result = await this.storytellingEpisodeMetaRepo.increment(
      { episodeId },
      'numVotes',
      1,
    );
    return result.affected;
  }

  async decrementNumVotes(episodeId: number) {
    const result = await this.storytellingEpisodeMetaRepo.increment(
      { episodeId },
      'numVotes',
      -1,
    );
    return result.affected;
  }
}
