import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePublicationFileDto } from './dto/publication-files.dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationFilesController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  create(@Body() payload: CreatePublicationFileDto) {
    return this.publicationsService.create(payload);
  }

  @Get()
  async findMany() {
    return this.publicationsService.findMany();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const pub = await this.publicationsService.findById(id);
    if (!pub) throw new NotFoundException();
    return {
      data: pub,
    };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const result = this.publicationsService.deleteById(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
