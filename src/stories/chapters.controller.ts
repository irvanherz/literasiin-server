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
} from '@nestjs/common';
import { User } from 'src/auth/user.decorator';
import { Mixed } from 'src/mixed.decorator';
import { ChaptersService } from './chapters.service';
import { ChapterFiltersDto } from './dto/chapter-filters.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { StoriesService } from './stories.service';

@Controller()
export class ChaptersController {
  constructor(
    private readonly storiesService: StoriesService,
    private readonly chaptersService: ChaptersService,
  ) {}

  @Post(['/stories/chapters', 'stories/:storyId/chapters'])
  async create(@Mixed(['body', 'params']) payload: CreateChapterDto) {
    console.log(payload);

    return await this.chaptersService.create(payload);
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
  async findById(@Param('id') id: number) {
    const chapter = await this.chaptersService.findById(id);
    return { data: chapter };
  }

  @Patch('/stories/chapters/:id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateChapterDto,
    @User() currentUser,
  ) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    if (story.userId !== currentUser?.id) throw new ForbiddenException();
    await this.chaptersService.updateById(id, setData);
    return true;
  }

  @Delete('/stories/chapters/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    if (story.userId !== currentUser?.id) throw new ForbiddenException();
    return this.chaptersService.deleteById(id);
  }
}
