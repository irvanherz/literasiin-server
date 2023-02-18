import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MediaFiltersDto } from './dto/media-filters.dto';
import { MediaService } from './media.service';

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async findMany(@Query() filters: MediaFiltersDto) {
    const [users, count] = await this.mediaService.findMany(filters);
    const numPages = Math.ceil(count / filters.limit);
    const meta = {
      page: filters.page,
      limit: filters.limit,
      numItems: count,
      numPages,
    };

    return {
      data: users,
      meta,
    };
  }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const res = await this.mediaService.uploadImage(file, req);
    return {
      data: res,
    };
  }
}
