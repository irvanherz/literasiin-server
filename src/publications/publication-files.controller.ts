import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { MediaService } from 'src/media/media.service';
import {
  CreatePublicationFileDto,
  PublicationFileFilterDto,
} from './dto/publication-files.dto';
import { PublicationFilesService } from './publication-files.service';

@Controller('publications/files')
export class PublicationFilesController {
  constructor(
    private readonly publicationFilesService: PublicationFilesService,
    private readonly mediaService: MediaService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findMany(
    @Query() filter: PublicationFileFilterDto,
    @User() currentUser,
  ) {
    const [files, count] = await this.publicationFilesService.findMany(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };
    return {
      data: files,
      meta,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreatePublicationFileDto,
    @User() currentUser,
  ) {
    payload.userId = sanitizeFilter(payload.userId || 'me', { currentUser });
    if (payload.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    const media = await this.mediaService.uploadDocument(payload as any, file, {
      tags: ['publication-file'],
    });
    const mediaId = media.id;
    const publicationId = payload.publicationId as any;
    await this.publicationFilesService.create({ publicationId, mediaId });
    return {
      data: media,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const media = await this.mediaService.findById(id);
    if (!media) throw new NotFoundException();

    if (media.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();

    await this.mediaService.deleteById(id);
    return;
  }
}
