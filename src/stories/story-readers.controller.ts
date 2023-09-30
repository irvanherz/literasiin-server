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
import { StoriesService } from './stories.service';
import { StoryReadersService } from './story-readers.service';

@Controller()
export class StoryReadersController {
  constructor(
    private readonly readersService: StoryReadersService,
    private readonly storiesService: StoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('stories/:storyId/readers/bookmark')
  async bookmark(@Param('storyId') storyId: number, @User() currentUser) {
    const userId = currentUser.id;
    const story = await this.storiesService.findById(storyId);
    if (!story) throw new NotFoundException();
    const reader = await this.readersService.setBookmark(storyId, userId, true);
    if (!reader) throw new NotFoundException();
    await this.storiesService.updateNumBookmarks(storyId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('stories/:storyId/readers/bookmark')
  async unbookmark(@Param('storyId') storyId: number, @User() currentUser) {
    const userId = currentUser.id;
    const story = await this.storiesService.findById(storyId);
    if (!story) throw new NotFoundException();
    const reader = await this.readersService.setBookmark(
      storyId,
      userId,
      false,
    );
    if (!reader) throw new NotFoundException();
    await this.storiesService.updateNumBookmarks(storyId);
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('stories/:storyId/readers/track')
  async track(@Param('storyId') storyId: number, @User() currentUser) {
    const userId = currentUser?.id || 0;
    const story = await this.storiesService.findById(storyId);
    if (!story) throw new NotFoundException();
    await this.readersService.track(story, userId);
    await this.storiesService.updateNumViews(storyId);
    return;
  }
}
