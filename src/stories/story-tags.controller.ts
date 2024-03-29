import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTagDto, UpdateTagDto } from './dto/stories.dto';
import { StoryTagFilterDto } from './dto/story-tag-filter.dto';
import { StoryTagsService } from './story-tags.service';

@Controller('/stories/tags')
export class StoryTagsController {
  constructor(private readonly tagsService: StoryTagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagsService.create(createTagDto);
  }

  @Get()
  async findMany(@Query() filter: StoryTagFilterDto) {
    const [data, count] = await this.tagsService.findMany(filter);
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const tag = await this.tagsService.findById(id);
    if (!tag) throw new NotFoundException();
    return { data: tag };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(@Param('id') id: number, @Body() setData: UpdateTagDto) {
    const tag = await this.tagsService.findById(id);
    if (!tag) throw new NotFoundException();
    await this.tagsService.updateById(id, setData);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const tag = await this.tagsService.findById(id);
    if (!tag) throw new NotFoundException();
    await this.tagsService.deleteById(id);
    return;
  }
}
