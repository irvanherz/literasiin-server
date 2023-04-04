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
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
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

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findMany(@Query() filter: ArticleFilterDto, @User() currentUser) {
    filter.userId = sanitizeFilter(filter.userId, { currentUser });
    filter.categoryId = sanitizeFilter(filter.categoryId);
    filter.status = sanitizeFilter(filter.status);
    filter.bookmarkedByUserId = sanitizeFilter(filter.bookmarkedByUserId, {
      currentUser,
    });
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

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/context')
  async getActionContext(@Param('id') id: number, @User() currentUser) {
    const chapter = await this.articlesService.findById(id);
    if (!chapter) throw new NotFoundException();
    const data = await this.articlesService.findContextById(
      id,
      currentUser?.id,
    );
    return { data };
  }
}
