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
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { sanitizeFilter } from 'src/libs/validations';
import { ArticlesService } from './articles.service';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() setData: CreateArticleDto, @Request() req) {
    const user = req.user;
    setData.userId = setData.userId || user.id;

    if (setData.userId !== user.id && user.role !== 'admin')
      throw new ForbiddenException();
    const data = await this.articlesService.create(setData);
    return { data };
  }

  @Get()
  async findMany(@Query() filter: ArticleFilterDto) {
    filter.status = sanitizeFilter(filter.status);
    const [data, count] = await this.articlesService.findMany(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const article = await this.articlesService.findById(id);
    if (!article) throw new NotFoundException();
    return { data: article };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateArticleDto,
    @Request() req,
  ) {
    const user = req.user;

    const article = await this.articlesService.findById(id);
    if (!article) throw new NotFoundException();
    if (user.id !== article.userId) throw new ForbiddenException();

    await this.articlesService.updateById(id, setData);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @Request() req) {
    const article = await this.articlesService.findById(id);
    const user = req.user;
    if (!article) throw new NotFoundException();
    if (user.id !== article.userId) throw new ForbiddenException();
    await this.articlesService.deleteById(id);
    return;
  }
}
