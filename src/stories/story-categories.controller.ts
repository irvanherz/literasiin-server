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
import { BulkUpdateCategoryDto } from './dto/bulk-update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StoryCategoriesService } from './story-categories.service';

@Controller('/stories/categories')
export class StoryCategoriesController {
  constructor(private readonly categoriesService: StoryCategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findMany() {
    const [data, count] = await this.categoriesService.findMany();
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException();
    return { data: category };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('bulk-update')
  async bulkUpdate(@Body() payload: BulkUpdateCategoryDto) {
    await this.categoriesService.bulkUpdate(payload.data);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException();
    await this.categoriesService.updateById(id, setData);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException();
    await this.categoriesService.deleteById(id);
    return;
  }
}
