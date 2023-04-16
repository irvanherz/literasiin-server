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
import {
  BulkUpdateKbCategoryDto,
  CreateKbCategoryDto,
  KbCategoryFilterDto,
  UpdateKbCategoryDto,
} from './dto/kbs.dto';
import { KbCategoriesService } from './kb-categories.service';

@Controller()
export class KbCategoriesController {
  constructor(private readonly categoriesService: KbCategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/kbs/categories')
  async create(@Body() payload: CreateKbCategoryDto) {
    const data = await this.categoriesService.create(payload);
    return { data };
  }

  @Get('/kbs/categories')
  async findMany(@Query() filter: KbCategoryFilterDto) {
    const [data, count] = await this.categoriesService.findMany(filter);
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get('/kbs/categories/:id')
  async findById(@Param('id') id: number) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException();
    return { data: category };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/kbs/categories/bulk-update')
  async bulkUpdate(@Body() payload: BulkUpdateKbCategoryDto) {
    console.log('OK');

    await this.categoriesService.bulkUpdate(payload.data);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/kbs/categories/:id')
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
  @Delete('/kbs/categories/:id')
  async deleteById(@Param('id') id: number) {
    const category = await this.categoriesService.findById(id);
    if (!category) throw new NotFoundException();
    await this.categoriesService.deleteById(id);
    return;
  }
}
