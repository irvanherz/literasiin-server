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
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryFiltersDto } from './dto/story-filters.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() setData: CreateStoryDto, @Request() req) {
    const user = req.user;
    setData.userId = setData.userId || user.id;

    if (setData.userId !== user.id && user.role !== 'admin')
      throw new ForbiddenException();
    return await this.storiesService.create(setData);
  }

  @Get()
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

  @Get(':id')
  async findById(@Param('id') id: number) {
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    return { data: story };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateStoryDto,
    @User() currentUser,
  ) {
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    if (currentUser.id !== story.userId && currentUser.role !== 'admin')
      throw new ForbiddenException();

    await this.storiesService.updateById(id, setData);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @Request() req) {
    const story = await this.storiesService.findById(id);
    const user = req.user;
    if (!story) throw new NotFoundException();
    if (user.id !== story.userId) throw new ForbiddenException();
    await this.storiesService.deleteById(id);
    return;
  }
}
