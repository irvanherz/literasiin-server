import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorytellingEpisodeAudience } from './entities/storytelling-episode-audience.entity';
import { StorytellingEpisodeMeta } from './entities/storytelling-episode-meta.entity';
import { StorytellingEpisode } from './entities/storytelling-episode.entity';
import { StorytellingMeta } from './entities/storytelling-meta.entity';
@Injectable()
export class StorytellingEpisodeAudiencesService {
  constructor(
    @InjectRepository(StorytellingEpisodeAudience)
    private audiencesRepo: Repository<StorytellingEpisodeAudience>,
    @InjectRepository(StorytellingEpisodeMeta)
    private episodeMetaRepo: Repository<StorytellingEpisodeMeta>,
    @InjectRepository(StorytellingMeta)
    private storytellingMetaRepo: Repository<StorytellingMeta>,
  ) {}

  async track(episode: StorytellingEpisode, userId: number) {
    userId = userId || 0;
    const episodeId = episode.id;

    let audience = await this.audiencesRepo.findOne({
      where: { episodeId, userId },
    });
    if (!audience) {
      audience = this.audiencesRepo.create({
        episodeId,
        userId,
        numListens: 0,
      });
    }
    audience.numListens += 1;
    await this.audiencesRepo.save(audience);
    return true;
  }

  async vote(episode: StorytellingEpisode, userId: number, vote: boolean) {
    const episodeId = episode.id;

    await this.audiencesRepo
      .createQueryBuilder('episode_audience')
      .insert()
      .values({ episodeId, userId, vote })
      .orUpdate(['vote'], ['episodeId', 'userId'])
      .execute();
    return true;
  }
}
