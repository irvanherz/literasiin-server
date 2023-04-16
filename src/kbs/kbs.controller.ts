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
import { CreateKbDto, KbFilterDto, UpdateKbDto } from './dto/kbs.dto';
import { KbsService } from './kbs.service';

@Controller()
export class KbsController {
  constructor(private readonly kbsService: KbsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('kbs')
  async create(@Body() setData: CreateKbDto, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const data = await this.kbsService.create(setData);
    return { data };
  }

  @Get('kbs')
  async findMany(@Query() filter: KbFilterDto) {
    const [data, count] = await this.kbsService.findMany(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };
    return { data, meta };
  }

  @Get('kbs/:id')
  async findById(@Param('id') id: number) {
    const kb = await this.kbsService.findById(id);
    if (!kb) throw new NotFoundException();
    return { data: kb };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('kbs/:id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateKbDto,
    @User() currentUser,
  ) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const kb = await this.kbsService.findById(id);
    if (!kb) throw new NotFoundException();

    await this.kbsService.updateById(id, payload);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('kbs/:id')
  async deleteById(@Param('id') id: number, @User() currentUser: any) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const kb = await this.kbsService.findById(id);
    if (!kb) throw new NotFoundException();
    await this.kbsService.deleteById(id);
    return;
  }
}
