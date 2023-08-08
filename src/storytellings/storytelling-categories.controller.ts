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
  BulkUpdateStorytellingCategoryDto,
  CreateStorytellingCategoryDto,
  StorytellingCategoryFilter,
  UpdateStorytellingCategoryDto,
} from './dto/storytelling-categories.dto';
import { StorytellingCategoriesService } from './storytelling-categories.service';

@Controller('/storytellings/categories')
export class StorytellingCategoriesController {
  constructor(
    private readonly categoriesService: StorytellingCategoriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateStorytellingCategoryDto) {
    return await this.categoriesService.create(payload as any);
  }

  @Get()
  async findMany(@Query() filters: StorytellingCategoryFilter) {
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
  async bulkUpdate(@Body() payload: BulkUpdateStorytellingCategoryDto) {
    await this.categoriesService.bulkUpdate(payload.data);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateStorytellingCategoryDto,
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
