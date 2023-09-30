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

    await this.readersService.vote(id, userId, true);
    await this.chaptersService.updateNumVotes(id);
    await this.storiesService.updateNumVotes(chapter.storyId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('stories/chapters/:chapterId/readers/vote')
  async devote(@Param('chapterId') id: number, @User() currentUser) {
    const userId = currentUser.id;
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();

    await this.readersService.vote(id, userId, false);
    await this.chaptersService.updateNumVotes(id);
    await this.storiesService.updateNumVotes(chapter.storyId);
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('stories/chapters/:chapterId/readers/track')
  async track(@Param('chapterId') id: number, @User() currentUser) {
    const userId = currentUser?.id || 0;
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();

    await this.readersService.track(chapter, userId);
    await this.chaptersService.updateNumReads(id);
    await this.storiesService.updateNumReads(chapter.storyId);
    return;
  }
}
