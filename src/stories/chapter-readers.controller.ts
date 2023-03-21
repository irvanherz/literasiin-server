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
import { ChapterReadersService } from './chapter-readers.service';
import { ChaptersService } from './chapters.service';
import { StoriesService } from './stories.service';

@Controller()
export class ChapterReadersController {
  constructor(
    private readonly readersService: ChapterReadersService,
    private readonly storiesService: StoriesService,
    private readonly chaptersService: ChaptersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('stories/chapters/:chapterId/readers/vote')
  async vote(@Param('chapterId') id: number, @User() currentUser) {
    const userId = currentUser.id;
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();

    await this.readersService.vote(id, userId, 1);
    await this.storiesService.incrementNumVotes(chapter.storyId);
    await this.chaptersService.incrementNumVotes(id);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('stories/chapters/:chapterId/readers/vote')
  async devote(@Param('chapterId') id: number, @User() currentUser) {
    const userId = currentUser.id;
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();

    await this.readersService.vote(id, userId, 0);
    await this.storiesService.decrementNumVotes(chapter.storyId);
    await this.chaptersService.decrementNumVotes(id);
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('stories/chapters/:chapterId/readers/track')
  async track(@Param('chapterId') id: number, @User() currentUser) {
    const userId = currentUser.id;
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();

    await this.readersService.track(id, userId);
    await this.storiesService.incrementNumViews(chapter.storyId);
    await this.chaptersService.incrementNumViews(id);
    return;
  }
}
