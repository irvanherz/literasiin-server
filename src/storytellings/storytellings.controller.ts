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
import {
  CreateStorytellingDto,
  StorytellingFilter,
  UpdateStorytellingDto,
} from './dto/storytellings.dto';
import { StorytellingEpisodesService } from './storytelling-episodes.service';
import { StorytellingsService } from './storytellings.service';

@Controller()
export class StorytellingsController {
  constructor(
    private readonly storytellingsService: StorytellingsService,
    private readonly episodesService: StorytellingEpisodesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('storytellings')
  async create(
    @Body() setData: CreateStorytellingDto,
    @User() currentUser: any,
  ) {
    setData.userId = setData.userId || currentUser.id;

    if (setData.userId !== currentUser.id && currentUser.role !== 'admin')
      throw new ForbiddenException();
    const data = await this.storytellingsService.create(setData as any);
    return { data };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('storytellings')
  async findMany(
    @Query() filter: StorytellingFilter,
    @User() currentUser: any,
  ) {
    filter.userId = sanitizeFilter(filter.userId, { currentUser });
    filter.categoryId = sanitizeFilter(filter.categoryId);
    filter.status = sanitizeFilter(filter.status);
    filter.bookmarkedByUserId = sanitizeFilter(filter.bookmarkedByUserId, {
      currentUser,
    });
    const [data, count] = await this.storytellingsService.findMany(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };
    return { data, meta };
  }

  @Get('storytellings/:id')
  async findById(@Param('id') id: number) {
    const storytelling = await this.storytellingsService.findById(id);
    if (!storytelling) throw new NotFoundException();
    return { data: storytelling };
  }

  @Get('storytellings/:id/tracks')
  async findTracksById(@Param('id') id: number) {
    const storytelling = await this.storytellingsService.findById(id);
    const [episodes] = await this.episodesService.findMany({
      storytellingId: id,
      limit: 1000,
      page: 1,
    } as any);
    if (!storytelling) throw new NotFoundException();
    return {
      data: {
        storytelling,
        episodes,
      },
    };
  }

  // @Post('storytellings/:id/tags/:tag')
  // async assignTag(@Param('id') id: number, @Param('tag') tag: string) {
  //   const storytelling = await this.storytellingsService.findById(id);
  //   if (!storytelling) throw new NotFoundException();
  //   await this.storytellingsService.assignTag(id, tag);
  // }

  // @Delete('storytellings/:id/tags/:tag')
  // async unassignTag(@Param('id') id: number, @Param('tag') tag: string) {
  //   const storytelling = await this.storytellingsService.findById(id);
  //   if (!storytelling) throw new NotFoundException();
  //   await this.storytellingsService.unassignTag(id, tag);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch('storytellings/:id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateStorytellingDto,
    @User() currentUser,
  ) {
    if (
      setData.userId &&
      setData.userId !== currentUser.id &&
      currentUser.role !== 'admin'
    )
      throw new BadRequestException();
    const storytelling = await this.storytellingsService.findById(id);
    if (!storytelling) throw new NotFoundException();

    if (
      !storytelling.authors.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();

    await this.storytellingsService.updateById(id, setData as any);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('storytellings/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const storytelling = await this.storytellingsService.findById(id);
    if (!storytelling) throw new NotFoundException();

    if (
      !storytelling.authors.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();

    await this.storytellingsService.deleteById(id);
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/storytellings/:id/context')
  async getActionContext(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.storytellingsService.findById(id);
    if (!chapter) throw new NotFoundException();
    const data = await this.storytellingsService.findContextById(
      id,
      currentUser?.id,
    );
    return { data };
  }
}
