import {
  Body,
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
import { ArticleReadersService } from './article-readers.service';
import { ArticlesService } from './articles.service';

@Controller()
export class ArticleReadersController {
  constructor(
    private readonly readersService: ArticleReadersService,
    private readonly articlesService: ArticlesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('articles/:articleId/readers/bookmark')
  async bookmark(@Param('articleId') articleId: number, @User() currentUser) {
    const userId = currentUser.id;
    const reader = await this.readersService.setBookmark(
      articleId,
      userId,
      true,
    );
    if (!reader) throw new NotFoundException();
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('articles/:articleId/readers/bookmark')
  async unbookmark(@Param('articleId') articleId: number, @User() currentUser) {
    const userId = currentUser.id;
    const reader = await this.readersService.setBookmark(
      articleId,
      userId,
      false,
    );
    if (!reader) throw new NotFoundException();
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('articles/:articleId/readers/vote')
  async vote(
    @Param('articleId') articleId: number,
    @Body('vote') vote: number,
    @User() currentUser,
  ) {
    const userId = currentUser.id;
    const reader = await this.readersService.setVote(articleId, userId, vote);
    if (!reader) throw new NotFoundException();
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('articles/:articleId/readers/track')
  async track(@Param('articleId') articleId: number, @User() currentUser) {
    const userId = currentUser.id;
    const reader = await this.readersService.track(articleId, userId);
    if (!reader) throw new NotFoundException();
    return;
  }
}
