import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('/chapters/chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  async create(@Body() createChapterDto: CreateChapterDto) {
    return await this.chaptersService.create(createChapterDto);
  }

  @Get()
  async findMany() {
    const [data, count] = await this.chaptersService.findMany();
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const chapter = await this.chaptersService.findById(id);
    return { data: chapter };
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    await this.chaptersService.updateById(id, updateChapterDto);
    return true;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const chapter = await this.chaptersService.findById(id);
    if (!chapter) throw new NotFoundException();
    return this.chaptersService.deleteById(id);
  }
}
