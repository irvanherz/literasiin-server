import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorytellingAudience } from './entities/storytelling-audience.entity';
import { StorytellingEpisodeAudience } from './entities/storytelling-episode-audience.entity';
import { StorytellingEpisode } from './entities/storytelling-episode.entity';
import { StorytellingMeta } from './entities/storytelling-meta.entity';

@Injectable()
export class StorytellingAudiencesService {
  constructor(
    @InjectRepository(StorytellingAudience)
    private audiencesRepo: Repository<StorytellingAudience>,
    @InjectRepository(StorytellingEpisodeAudience)
    private episodeAudiencesRepo: Repository<StorytellingEpisodeAudience>,
    @InjectRepository(StorytellingMeta)
    private metaRepo: Repository<StorytellingMeta>,
    @InjectRepository(StorytellingEpisode)
    private episodesRepo: Repository<StorytellingEpisode>,
  ) {}

  async track(storytellingId: number, userId: number) {
    let audience = await this.audiencesRepo.findOne({
      where: { storytellingId, userId },
    });
    if (!audience) {
      audience = this.audiencesRepo.create({ storytellingId, userId });
    }
    audience.numViews += 1;
    await this.audiencesRepo.save(audience);
    return audience;
  }

  async setBookmark(storytellingId: number, userId: number, bookmark: boolean) {
    let audience = await this.audiencesRepo.findOne({
      where: { storytellingId, userId },
    });
    if (!audience) {
      audience = await this.audiencesRepo.save({
        storytellingId,
        userId,
        bookmark,
      });
    } else {
      audience.bookmark = bookmark;
      audience = await this.audiencesRepo.save(audience);
    }
    return audience;
  }

  async findContextById(storytellingId: number, userId: number) {
    const data = await this.audiencesRepo.findOne({
      where: { storytellingId, userId },
    });
    const subdata = await this.episodeAudiencesRepo
      .createQueryBuilder('audience')
      .innerJoin(
        StorytellingEpisode,
        'episode',
        'episode.id=audience.episodeId',
      )
      .where(
        'episode.storytellingId=:storytellingId AND audience.userId=:userId',
        { storytellingId, userId },
      )
      .getMany();
    return [data, subdata];
  }
}
