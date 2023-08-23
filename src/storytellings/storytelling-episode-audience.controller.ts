import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { StorytellingEpisodeAudiencesService } from './storytelling-episode-audience.service';
import { StorytellingEpisodesService } from './storytelling-episodes.service';
import { StorytellingsService } from './storytellings.service';

@Controller()
export class StorytellingEpisodeAudiencesController {
  constructor(
    private readonly audiencesService: StorytellingEpisodeAudiencesService,
    private readonly storytellingsService: StorytellingsService,
    private readonly episodesService: StorytellingEpisodesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('storytellings/episodes/:episodeId/audiences/vote')
  async vote(@Param('episodeId') episodeId: number, @User() currentUser) {
    const userId = currentUser.id;

    console.log(episodeId);

    const episode = await this.episodesService.findById(episodeId);
    if (!episode) throw new NotFoundException('Episode not found');

    await this.audiencesService.vote(episode, userId, true);
    await this.episodesService.updateNumVotes(episode.id);
    await this.storytellingsService.updateNumVotes(episode.storytellingId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('storytellings/episodes/:episodeId/audiences/vote')
  async devote(@Param('episodeId') id: number, @User() currentUser) {
    const userId = currentUser.id;
    const episode = await this.episodesService.findById(id);
    if (!episode) throw new NotFoundException();

    await this.audiencesService.vote(episode, userId, false);
    await this.episodesService.updateNumVotes(episode.id);
    await this.storytellingsService.updateNumVotes(episode.storytellingId);

    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('storytellings/episodes/:episodeId/audiences/track')
  async track(@Param('episodeId') id: number, @User() currentUser) {
    const userId = currentUser.id || 0;
    const episode = await this.episodesService.findById(id);
    if (!episode) throw new NotFoundException();

    await this.audiencesService.track(episode, userId);
    await this.episodesService.updateNumListens(episode.id);
    await this.storytellingsService.updateNumListeners(episode.storytellingId);

    return;
  }
}
