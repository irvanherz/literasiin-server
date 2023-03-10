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
import { BulkUpdateKbCategoryDto } from './dto/bulk-update-kb-category.dto';
import { CreateKbCategoryDto } from './dto/create-kb-category.dto';
import { KbCategoryFilterDto } from './dto/kb-category-filter.dto';
import { UpdateKbCategoryDto } from './dto/update-kb-category.dto';
import { KbCategoriesService } from './kb-categories.service';

@Controller('/kbs/categories')
export class KbCategoriesController {
  constructor(private readonly categoriesService: KbCategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateKbCategoryDto) {
    const data = await this.categoriesService.create(payload);
    return { data };
  }

  @Get()
  async findMany(@Query() filter: KbCategoryFilterDto) {
    const [data, count] = await this.categoriesService.findMany(filter);
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
  async bulkUpdate(@Body() payload: BulkUpdateKbCategoryDto) {
    console.log('OK');

    await this.categoriesService.bulkUpdate(payload.data);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateKbCategoryDto,
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
