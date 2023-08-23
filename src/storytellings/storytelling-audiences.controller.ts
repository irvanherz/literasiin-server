import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { StorytellingAudiencesService } from './storytelling-audiences.service';
import { StorytellingsService } from './storytellings.service';

@Controller()
export class StorytellingAudiencesController {
  constructor(
    private readonly audiencesService: StorytellingAudiencesService,
    private readonly storytellingsService: StorytellingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('storytellings/:storytellingId/audiences/bookmark')
  async bookmark(
    @Param('storytellingId') storytellingId: number,
    @User() currentUser,
  ) {
    const userId = currentUser.id;
    const audience = await this.audiencesService.setBookmark(
      storytellingId,
      userId,
      true,
    );
    if (!audience) throw new NotFoundException();
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('storytellings/:storytellingId/audiences/bookmark')
  async unbookmark(
    @Param('storytellingId') storytellingId: number,
    @User() currentUser,
  ) {
    const userId = currentUser.id;
    const audience = await this.audiencesService.setBookmark(
      storytellingId,
      userId,
      false,
    );
    if (!audience) throw new NotFoundException();
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('storytellings/:storytellingId/audiences/track')
  async track(
    @Param('storytellingId') storytellingId: number,
    @User() currentUser,
  ) {
    const userId = currentUser.id || 0;
    const storytelling = await this.storytellingsService.findById(
      storytellingId,
    );
    if (!storytelling) throw new NotFoundException();

    await this.audiencesService.track(storytellingId, userId);
    await this.storytellingsService.updateNumViews(storytellingId);
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('storytellings/:storytellingId/audiences/context')
  async getActionContext(
    @Param('storytellingId') storytellingId: number,
    @User() currentUser,
  ) {
    const userId = currentUser?.id || 0;
    if (!userId) return { data: { storytelling: null, episodes: [] } };
    const chapter = await this.storytellingsService.findById(storytellingId);
    if (!chapter) throw new NotFoundException();
    const [storytelling, episodes] =
      await this.audiencesService.findContextById(storytellingId, userId);
    return {
      data: { storytelling, episodes },
    };
  }
}
