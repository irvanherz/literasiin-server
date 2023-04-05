import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationFilesController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationsService.create(createPublicationDto);
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

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() setData: UpdatePublicationDto,
  ) {
    const result = await this.publicationsService.updateById(id, setData);
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
