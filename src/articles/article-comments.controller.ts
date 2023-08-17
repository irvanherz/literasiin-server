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
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { ArticleCommentsService } from './article-comments.service';
import {
  ArticleCommentFilterDto,
  CreateArticleCommentDto,
  UpdateArticleCommentDto,
} from './dto/article-comments.dto';

@Controller('/articles/comments')
export class ArticleCommentsController {
  constructor(private readonly commentsService: ArticleCommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateArticleCommentDto, @User() currentUser) {
    payload.userId = sanitizeFilter(payload.userId, { currentUser });
    return await this.commentsService.create(payload as any);
  }

  @Get()
  async findMany(@Query() filter: ArticleCommentFilterDto) {
    const [data, count] = await this.commentsService.findMany(filter);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numPages: Math.ceil(count / filter.limit),
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new NotFoundException();
    return { data: comment };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateArticleCommentDto,
  ) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new NotFoundException();
    await this.commentsService.updateById(id, setData);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new NotFoundException();
    await this.commentsService.deleteById(id);
    return;
  }
}
