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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { Mixed } from 'src/mixed.decorator';
import { ChaptersService } from './chapters.service';
import {
  ChapterFiltersDto,
  FindChapterByIdOptions,
} from './dto/chapter-filters.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { StoriesService } from './stories.service';

@Controller()
export class ChaptersController {
  constructor(
    private readonly storiesService: StoriesService,
    private readonly chaptersService: ChaptersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(['/stories/chapters', 'stories/:storyId/chapters'])
  async create(@Mixed(['body', 'params']) payload: CreateChapterDto) {
    const data = await this.chaptersService.create(payload);
    return { data };
  }

  @Get('/stories/chapters')
  async findMany(@Query() filters: ChapterFiltersDto) {
    const [data, count] = await this.chaptersService.findMany(filters);
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get('/stories/chapters/:id')
  async findById(
    @Param('id') id: number,
    @Query() options: FindChapterByIdOptions,
  ) {
    const chapter = await this.chaptersService.findById(id, options);
    return { data: chapter };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/stories/chapters/:id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateChapterDto,
    @User() currentUser,
  ) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    const story = await this.storiesService.findById(chapter.storyId);
    if (!story) throw new NotFoundException();
    if (story.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    await this.chaptersService.updateById(id, setData);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/stories/chapters/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    const story = await this.storiesService.findById(chapter.storyId);
    if (!story) throw new NotFoundException();
    if (story.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    return this.chaptersService.deleteById(id);
  }
}
