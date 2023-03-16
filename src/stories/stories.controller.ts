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
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryFiltersDto } from './dto/story-filters.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller()
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stories')
  async create(@Body() setData: CreateStoryDto, @Request() req) {
    const user = req.user;
    setData.userId = setData.userId || user.id;

    if (setData.userId !== user.id && user.role !== 'admin')
      throw new ForbiddenException();
    const data = await this.storiesService.create(setData);
    return { data };
  }

  @Get('stories')
  async findMany(@Query() filters: StoryFiltersDto) {
    const [data, count] = await this.storiesService.findMany(filters);
    const numPages = Math.ceil(count / filters.limit);
    const meta = {
      page: filters.page,
      limit: filters.limit,
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
    if (currentUser.id !== story.userId && currentUser.role !== 'admin')
      throw new ForbiddenException();

    await this.storiesService.updateById(id, setData);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('stories/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const story = await this.storiesService.findById(id);

    if (!story) throw new NotFoundException();
    if (currentUser?.id !== story.userId && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    await this.storiesService.deleteById(id);
    return;
  }
}
