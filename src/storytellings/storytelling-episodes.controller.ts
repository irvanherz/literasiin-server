import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { Mixed } from 'src/mixed.decorator';
import {
  CreateStorytellingEpisodeDto,
  FindStorytellingEpisodeByIdOptions,
  FindTrackByIdOptions,
  StorytellingEpisodeFilter,
  UpdateStorytellingEpisodeDto,
} from './dto/storytelling-episodes.dto';
import { StorytellingEpisodesService } from './storytelling-episodes.service';
import { StorytellingsService } from './storytellings.service';

@Controller()
export class StorytellingEpisodesController {
  constructor(
    private readonly storytellingsService: StorytellingsService,
    private readonly episodesService: StorytellingEpisodesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(['/storytellings/episodes', 'storytellings/:storytellingId/episodes'])
  async create(
    @Mixed(['body', 'params']) payload: CreateStorytellingEpisodeDto,
    @User() currentUser,
  ) {
    const storytelling = await this.storytellingsService.findById(
      payload.storytellingId,
    );
    if (!storytelling) throw new NotFoundException();
    if (
      !storytelling.authors.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();
    const data = await this.episodesService.create(payload as any);
    await this.storytellingsService.updateNumEpisodes(data.storytellingId);
    return { data };
  }

  @Get('/storytellings/episodes')
  async findMany(@Query() filter: StorytellingEpisodeFilter) {
    filter.status = sanitizeFilter(filter.status);
    const [data, count] = await this.episodesService.findMany(filter);
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get('/storytellings/episodes/:id')
  async findById(
    @Param('id') id: number,
    @Query() options: FindStorytellingEpisodeByIdOptions,
  ) {
    const episode = await this.episodesService.findById(id, options);
    if (!episode) throw new NotFoundException();
    return { data: episode };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/storytellings/episodes/:id/track')
  async findTrackById(
    @Param('id') id: number,
    @Query() opts: FindTrackByIdOptions,
  ) {
    const data = await this.episodesService.findTrackById(id, opts);
    return {
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/storytellings/episodes/:id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateStorytellingEpisodeDto,
    @User() currentUser,
  ) {
    const episode = await this.episodesService.findById(id);
    if (!episode) throw new NotFoundException();
    const storytelling = await this.storytellingsService.findById(
      episode.storytellingId,
    );
    if (!storytelling) throw new NotFoundException();
    if (
      !storytelling.authors.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();
    await this.episodesService.updateById(id, payload as any);
    if (payload.status)
      await this.storytellingsService.updateNumEpisodes(episode.storytellingId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/storytellings/episodes/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const episode = await this.episodesService.findById(id);
    if (!episode) throw new NotFoundException();
    const storytelling = await this.storytellingsService.findById(
      episode.storytellingId,
    );
    if (!storytelling) throw new NotFoundException();
    if (
      !storytelling.authors.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();
    await this.episodesService.deleteById(id);
    await this.storytellingsService.updateNumEpisodes(episode.storytellingId);
    return;
  }
}
