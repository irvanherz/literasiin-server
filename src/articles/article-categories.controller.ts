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
import { ArticleCategoriesService } from './article-categories.service';
import { ArticleCategoryFiltersDto } from './dto/article-category-filters.dto';
import { BulkUpdateCategoryDto } from './dto/bulk-update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('/articles/categories')
export class ArticleCategoriesController {
  constructor(private readonly categoriesService: ArticleCategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findMany(@Query() filters: ArticleCategoryFiltersDto) {
    const [data, count] = await this.categoriesService.findMany(filters);
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
    console.log('OK');

    await this.categoriesService.bulkUpdate(payload.data);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateCategoryDto,
  ) {
    console.log('LAH');
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
