import {
  BadRequestException,
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
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { Mixed } from 'src/mixed.decorator';
import { WalletTransactionsService } from 'src/wallets/wallet-transactions.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { ChaptersService } from './chapters.service';
import {
  ChapterFilterDto,
  FindChapterByIdOptions,
} from './dto/chapter-filter.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { StoriesService } from './stories.service';
import { StoryAccessesService } from './story-accesses.service';

@Controller()
export class ChaptersController {
  constructor(
    private readonly storiesService: StoriesService,
    private readonly chaptersService: ChaptersService,
    private readonly walletTrxSvc: WalletTransactionsService,
    private readonly walletSvc: WalletsService,
    private readonly accessesSvc: StoryAccessesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(['/stories/chapters', 'stories/:storyId/chapters'])
  async create(
    @Mixed(['body', 'params']) payload: CreateChapterDto,
    @User() currentUser,
  ) {
    const story = await this.storiesService.findById(payload.storyId);
    if (!story) throw new NotFoundException();
    if (
      !story.writers.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();
    const data = await this.chaptersService.create(payload as any);
    return { data };
  }

  @Get('/stories/chapters')
  async findMany(@Query() filter: ChapterFilterDto) {
    filter.status = sanitizeFilter(filter.status);
    const [data, count] = await this.chaptersService.findMany(filter);
    data.forEach((c) => (c.content = ''));
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/stories/chapters/:id')
  async findById(
    @Param('id') id: number,
    @Query() options: FindChapterByIdOptions,
    @User() currentUser,
  ) {
    const chapter = await this.chaptersService.findById(id, options);
    if (!chapter) throw new NotFoundException();
    const story = await this.storiesService.findById(chapter.storyId);
    const canRead = !!(
      story.writers.find((w) => w.id === currentUser?.id) ||
      currentUser?.role === 'admin'
    );
    if (!canRead) chapter.content = '';
    return { data: chapter };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/stories/chapters/:id/read')
  async readById(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.chaptersService.findById(id, {
      includeStory: true,
    });
    if (!chapter) throw new NotFoundException();
    const access = await this.accessesSvc.findByChapterAndUserId(
      chapter,
      currentUser?.id || 0,
    );
    const writers = chapter.story?.writers || [];
    const canRead = !!(
      +chapter.price === 0 ||
      access ||
      writers.find((w) => w.id === currentUser?.id) ||
      currentUser?.role === 'admin'
    );

    if (!canRead) chapter.content = '';

    return {
      data: chapter,
      meta: {
        canRead,
        access,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/stories/chapters/:id/unlock')
  async unlockById(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.chaptersService.findById(id, {
      includeStory: true,
    });
    if (!chapter) throw new NotFoundException();
    if (+chapter.price === 0) throw new BadRequestException();
    if (chapter.story.writers.find((w) => w.userId === currentUser.id))
      throw new BadRequestException(
        'You are already have access',
        'story/chapter/unlock-failed',
      );
    const existingAccess = await this.accessesSvc.findByChapterAndUserId(
      chapter,
      currentUser?.id || 0,
    );
    if (existingAccess)
      throw new BadRequestException(
        'You are already have access',
        'story/chapter/unlock-failed',
      );
    const wallet = await this.walletSvc.findUserCoinWallet(currentUser.id);
    await this.walletTrxSvc.create({
      amount: -chapter.price,
      description: 'Unlock chapter',
      meta: { storyId: chapter.storyId, chapterId: chapter.id },
      walletId: wallet.id,
    });
    const access = await this.accessesSvc.create({
      storyId: chapter.storyId,
      chapterId: chapter.id,
      userId: currentUser.id,
    });
    return { data: access };
  }

  // @Post('/stories/chapters/:id/view')
  // async view(@Param('id') id: number) {
  //   const chapter = await this.chaptersService.findById(id);
  //   if (!chapter) throw new NotFoundException();
  //   await this.storiesService.incrementNumViews(chapter.storyId);
  //   await this.chaptersService.incrementNumViews(id);
  //   return;
  // }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/stories/chapters/:id/context')
  async getActionContext(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    const data = await this.chaptersService.findContextById(
      id,
      currentUser?.id,
    );
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/stories/chapters/:id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateChapterDto,
    @User() currentUser,
  ) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    const story = await this.storiesService.findById(chapter.storyId);
    if (!story) throw new NotFoundException();
    if (
      !story.writers.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();
    await this.chaptersService.updateById(id, payload as any);
    await this.storiesService.updateNumChapters(story.id);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/stories/chapters/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    const story = await this.storiesService.findById(chapter.storyId);
    if (!story) throw new NotFoundException();
    if (
      !story.writers.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();
    await this.chaptersService.deleteById(id);
    return;
  }
}
