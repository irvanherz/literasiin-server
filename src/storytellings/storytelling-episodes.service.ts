import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import {
  FindStorytellingEpisodeByIdOptions,
  FindTrackByIdOptions,
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
    private readonly audiencesRepo: Repository<StorytellingEpisodeAudience>,
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

    const result = await this.episodesRepo.findOne({
      where: { id },
      relations: { storytelling: includeStorytelling ? true : undefined },
    });
    return result;
  }

  async findTrackById(id: number, options: FindTrackByIdOptions = {}) {
    const current = await this.episodesRepo.findOne({
      where: { id },
      relations: { storytelling: true },
    });
    if (!current) throw new NotFoundException();
    const prev = await this.episodesRepo.findOne({
      where: {
        storytellingId: current.storytellingId,
        id: LessThan(current.id),
        status: options.status !== 'any' ? options.status : undefined,
      },
    });
    const next = await this.episodesRepo.findOne({
      where: {
        storytellingId: current.storytellingId,
        id: MoreThan(current.id),
        status: options.status !== 'any' ? options.status : undefined,
      },
    });
    return { current, prev, next };
  }

  async updateById(id: number, payload: Partial<StorytellingEpisode>) {
    const result = await this.episodesRepo.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.episodesRepo.delete(id);
    return result.affected;
  }

  // async incrementNumListens(episodeId: number) {
  //   const result = await this.storytellingEpisodeMetaRepo.increment(
  //     { episodeId },
  //     'numListens',
  //     1,
  //   );
  //   return result.affected;
  // }
  async updateNumVotes(episodeId: number) {
    const numVotes = await this.audiencesRepo.count({
      where: { episodeId, vote: true },
    });
    await this.storytellingEpisodeMetaRepo.update({ episodeId }, { numVotes });
  }

  async updateNumListens(episodeId: number) {
    const numListens = await this.audiencesRepo.sum('numListens', {
      episodeId,
    });
    await this.storytellingEpisodeMetaRepo.update(
      { episodeId },
      { numListens },
    );
  }
}
