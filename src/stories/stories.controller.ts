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
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryFilterDto } from './dto/story-filter.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller()
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stories')
  async create(@Body() setData: CreateStoryDto, @User() currentUser: any) {
    setData.userId = setData.userId || currentUser.id;

    if (setData.userId !== currentUser.id && currentUser.role !== 'admin')
      throw new ForbiddenException();
    const data = await this.storiesService.create(setData);
    return { data };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('stories')
  async findMany(@Query() filter: StoryFilterDto, @User() currentUser: any) {
    filter.userId = sanitizeFilter(filter.userId || 'me', { currentUser });
    filter.categoryId = sanitizeFilter(filter.categoryId);
    filter.status = sanitizeFilter(filter.status);
    filter.bookmarkedByUserId = sanitizeFilter(filter.bookmarkedByUserId, {
      currentUser,
    });
    const [data, count] = await this.storiesService.findMany(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };
    return { data, meta };
  }

  @Get('stories/:id')
  async findById(@Param('id') id: number) {
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    return { data: story };
  }

  @Post('stories/:id/tags/:tag')
  async assignTag(@Param('id') id: number, @Param('tag') tag: string) {
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    await this.storiesService.assignTag(id, tag);
  }

  @Delete('stories/:id/tags/:tag')
  async unassignTag(@Param('id') id: number, @Param('tag') tag: string) {
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    await this.storiesService.unassignTag(id, tag);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('stories/:id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateStoryDto,
    @User() currentUser,
  ) {
    if (
      setData.userId &&
      setData.userId !== currentUser.id &&
      currentUser.role !== 'admin'
    )
      throw new BadRequestException();
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();

    if (
      !story.writers.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();

    await this.storiesService.updateById(id, setData);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('stories/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();

    if (
      !story.writers.some((w) => w.id === currentUser?.id) &&
      currentUser?.role !== 'admin'
    )
      throw new ForbiddenException();

    await this.storiesService.deleteById(id);
    return;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/stories/:id/context')
  async getActionContext(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.storiesService.findById(id);
    if (!chapter) throw new NotFoundException();
    const data = await this.storiesService.findContextById(id, currentUser?.id);
    return { data };
  }
}
