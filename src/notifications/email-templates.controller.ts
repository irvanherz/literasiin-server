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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { EmailTemplateFiltersDto } from './dto/email-template-filters.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { EmailTemplatesService } from './email-templates.service';

@Controller('notifications/email-templates')
export class EmailTemplatesController {
  constructor(private readonly templatesService: EmailTemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateEmailTemplateDto) {
    const template = await this.templatesService.create(body);
    if (!template) throw new NotFoundException();
    return { data: template };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(@Query() filters: EmailTemplateFiltersDto) {
    const [templates, count] = await this.templatesService.findMany(filters);
    const numPages = Math.ceil(count / filters.limit);
    const meta = {
      page: filters.page,
      limit: filters.limit,
      numItems: count,
      numPages,
    };

    return {
      data: templates,
      meta,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: number) {
    const template = await this.templatesService.findById(id);
    if (!template) throw new NotFoundException();
    return { data: template };
  }

  @UseGuards(JwtAuthGuard)
  @Get('name/:name')
  async findByUsername(@Param('name') templatename: string) {
    const template = await this.templatesService.findByName(templatename);
    if (!template) throw new NotFoundException();
    return { data: template };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdateEmailTemplateDto,
    @User() currentUser,
  ) {
    if (id !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    const template = await this.templatesService.findById(id);
    if (!template) throw new NotFoundException();
    await this.templatesService.updateById(id, setData);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const template = await this.templatesService.findById(id);
    if (!template) throw new NotFoundException();
    return this.templatesService.deleteById(id);
  }
}
