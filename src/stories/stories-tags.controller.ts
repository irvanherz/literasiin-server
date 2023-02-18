import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
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
  async findMany() {
    const [data, count] = await this.tagsService.findMany();
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
