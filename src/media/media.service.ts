import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { MinioService } from 'nestjs-minio-client';
import * as path from 'path';
import * as sharp from 'sharp';
import slugify from 'slugify';
import { ArrayContains, ILike, Repository } from 'typeorm';
import { MediaFiltersDto } from './dto/media-filters.dto';
import { Media } from './entities/media.entity';

const PHOTO_SIZES = [
  {
    id: 'lg',
    width: 400,
    height: 400,
  },
  {
    id: 'md',
    width: 200,
    height: 200,
  },
  {
    id: 'sm',
    width: 100,
    height: 100,
  },
];

const COVER_SIZES = [
  {
    id: 'lg',
    width: 600,
    height: 900,
  },
  {
    id: 'md',
    width: 400,
    height: 600,
  },
  {
    id: 'sm',
    width: 200,
    height: 300,
  },
];

const ARTICLE_IMAGE_SIZES = [
  {
    id: 'lg',
    width: 900,
    height: 450,
  },
  {
    id: 'md',
    width: 600,
    height: 300,
  },
  {
    id: 'sm',
    width: 300,
    height: 150,
  },
];

const PRESETS = {
  photo: {
    sizes: PHOTO_SIZES,
    data: {
      type: 'image',
      tags: ['photo'],
    },
  },
  'story-cover': {
    sizes: COVER_SIZES,
    data: {
      type: 'image',
      tags: ['story-cover'],
    },
  },
  'article-image': {
    sizes: ARTICLE_IMAGE_SIZES,
    data: {
      type: 'image',
      tags: ['article-image'],
    },
  },
};

@Injectable()
export class MediaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}

  async uploadImage(file: Express.Multer.File, request: Request) {
    const user = request.user as any;
    const userId = user?.id;
    const presetId = request.body.preset;
    const preset: any = PRESETS[presetId];
    if (!preset) throw new BadRequestException();
    const baseUrl =
      'https://' + this.configService.get<string>('MINIO_ENDPOINT');
    const bucket = this.configService.get<string>('MINIO_BUCKET');
    const nameComponents = path.parse(file.originalname);
    const nameBase =
      Date.now().toString() +
      '_' +
      slugify(nameComponents.name, {
        replacement: '-',
        trim: true,
        lower: true,
      });
    const uploads = [];
    for await (const size of preset.sizes) {
      const objectName = `${nameBase}_${size.id}.jpg`;
      const output = sharp(file.buffer)
        .resize({
          width: size.width,
          height: size.height,
          fit: 'cover',
        })
        .toFormat('jpg')
        .pipe(sharp());
      const meta = await output.metadata();
      await this.minioService.client.putObject(bucket, objectName, output, {
        'Content-Type': 'image/jpeg',
      });
      const url = `${baseUrl}/${bucket}/${objectName}`;
      uploads.push({
        ...size,
        url,
        name: objectName,
        meta,
      });
    }
    const media = await this.mediaRepo.save({
      ...preset.data,
      userId,
      name: nameBase,
      meta: {
        objects: uploads,
        originalName: file.originalname,
      },
    });
    return media;
  }

  async findMany(filters: MediaFiltersDto) {
    const take = filters.limit || 1;
    const skip = (filters.page - 1) * take;
    const result = this.mediaRepo.findAndCount({
      where: {
        type: (filters?.type as any) || undefined,
        tags: filters?.tag ? ArrayContains([filters.tag as any]) : undefined,
        name: filters?.search ? ILike(`%${filters.search}%`) : undefined,
        userId: filters.userId ? (filters.userId as any) : undefined,
      },
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
    });
    return result;
  }
}
