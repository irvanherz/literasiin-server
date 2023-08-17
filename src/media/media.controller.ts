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
import {
  CreateAudioMediaDto,
  CreateImageMediaDto,
  MediaFilterDto,
} from './dto/media.dto';
import { MediaService } from './media.service';

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findMany(@Query() filter: MediaFilterDto, @User() currentUser) {
    filter.userId = sanitizeFilter(filter.userId, {
      currentUser,
      toNumber: true,
    });
    filter.type = sanitizeFilter(filter.type);

    const [users, count] = await this.mediaService.findMany(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };

    return {
      data: users,
      meta,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateImageMediaDto,
    @User() currentUser,
  ) {
    payload.userId = sanitizeFilter(payload.userId || 'me', { currentUser });
    if (payload.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    const res = await this.mediaService.uploadImage(payload, file);
    return {
      data: res,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateAudioMediaDto,
    @User() currentUser,
  ) {
    payload.userId = sanitizeFilter(payload.userId || 'me', { currentUser });
    if (payload.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    const res = await this.mediaService.uploadAudio(payload, file);
    return {
      data: res,
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
