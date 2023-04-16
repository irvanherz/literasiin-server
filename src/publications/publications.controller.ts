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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publications.dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() payload: CreatePublicationDto, @User() currentUser) {
    payload.userId = sanitizeFilter(payload.userId || 'me', { currentUser });
    if (payload.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    return this.publicationsService.create(payload as any);
  }

  @Get()
  async findMany() {
    const [data, numItems] = await this.publicationsService.findMany();
    const meta = { numItems };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const pub = await this.publicationsService.findById(id);
    if (!pub) throw new NotFoundException();
    return {
      data: pub,
    };
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdatePublicationDto,
  ) {
    const result = await this.publicationsService.updateById(
      id,
      payload as any,
    );
    if (!result) throw new NotFoundException();
    return;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const result = this.publicationsService.deleteById(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
