import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { parseBuffer } from 'music-metadata-browser';
import { MinioService } from 'nestjs-minio-client';
import * as path from 'path';
import * as sharp from 'sharp';
import slugify from 'slugify';
import { ArrayContains, ILike, Repository } from 'typeorm';
import {
  CreateAudioMediaDto,
  CreateDocumentMediaDto,
  CreateImageMediaDto,
  MediaFilterDto,
} from './dto/media.dto';
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

const STORYTELLING_COVER_SIZES = [
  {
    id: 'lg',
    width: 920,
    height: 920,
  },
  {
    id: 'md',
    width: 640,
    height: 640,
  },
  {
    id: 'sm',
    width: 320,
    height: 320,
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

const ASSET_IMAGE_SIZES = [
  {
    id: 'lg',
    width: 900,
    height: undefined,
  },
  {
    id: 'md',
    width: 600,
    height: undefined,
  },
  {
    id: 'sm',
    width: 300,
    height: undefined,
  },
  {
    id: 'original',
    width: undefined,
    height: undefined,
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
  'storytelling-cover': {
    sizes: STORYTELLING_COVER_SIZES,
    data: {
      type: 'image',
      tags: ['storytelling-cover'],
    },
  },
  'article-image': {
    sizes: ARTICLE_IMAGE_SIZES,
    data: {
      type: 'image',
      tags: ['article-image'],
    },
  },
  asset: {
    sizes: ASSET_IMAGE_SIZES,
    data: {
      type: 'image',
      tags: ['asset'],
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

  async uploadImage(
    payload: CreateImageMediaDto,
    file: Express.Multer.File,
    extra: Partial<Media> = {},
  ) {
    const userId = payload?.userId;
    const presetId = payload.preset;
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
      let output = sharp(file.buffer);
      if (size.width || size.height) {
        output = output.resize({
          width: size.width,
          height: size.height,
          fit: 'cover',
        });
      }
      output = output.toFormat('jpg').pipe(sharp());
      const meta = await output.metadata();
      await this.minioService.client.putObject(bucket, objectName, output, {
        'Content-Type': 'image/jpeg',
      });
      const url = `${baseUrl}/${bucket}/${objectName}`;
      uploads.push({
        ...size,
        width: meta?.width || size?.width,
        height: meta?.height || size?.height,
        url,
        name: objectName,
        meta,
      });
    }
    const media = await this.mediaRepo.save({
      ...preset.data,
      type: 'image',
      userId,
      name: nameBase,
      meta: {
        objects: uploads,
        originalName: file.originalname,
        originalSize: file.size,
      },
      ...extra,
    });
    return media;
  }

  async uploadDocument(
    payload: CreateDocumentMediaDto,
    file: Express.Multer.File,
    extra: Partial<Media> = {},
  ) {
    const userId = payload?.userId;
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
    const objectName = `${nameBase}_original.${nameComponents.ext}`;

    await this.minioService.client.putObject(bucket, objectName, file.buffer, {
      'Content-Type': 'application/octet-stream',
    });
    const url = `${baseUrl}/${bucket}/${objectName}`;
    uploads.push({
      url,
      name: objectName,
      meta: {
        size: file.buffer.length,
      },
    });
    const media = await this.mediaRepo.save({
      userId: userId as any,
      type: 'document',
      name: nameBase,
      meta: {
        objects: uploads,
        originalName: file.originalname,
        originalSize: file.size,
      },
      ...extra,
    });
    return media;
  }

  async uploadAudio(
    payload: CreateAudioMediaDto,
    file: Express.Multer.File,
    extra: Partial<Media> = {},
  ) {
    const userId = payload?.userId;
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
    const objectName = `${nameBase}_original.mp3`;

    await this.minioService.client.putObject(bucket, objectName, file.buffer, {
      'Content-Type': 'audio/mp3',
    });
    const meta = await parseBuffer(file.buffer);
    const url = `${baseUrl}/${bucket}/${objectName}`;
    uploads.push({
      url,
      name: objectName,
      meta: {
        ...meta,
        size: file.buffer.length,
      },
    });
    const media = await this.mediaRepo.save({
      tags: ['storytelling-audio'],
      userId: userId as any,
      type: 'audio',
      name: nameBase,
      meta: {
        objects: uploads,
        originalName: file.originalname,
        originalSize: file.size,
      },
      ...extra,
    });
    return media;
  }

  async findMany(filter: MediaFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = this.mediaRepo.findAndCount({
      where: {
        type: (filter?.type as any) || undefined,
        tags: filter?.tag ? ArrayContains([filter.tag as any]) : undefined,
        name: filter?.search ? ILike(`%${filter.search}%`) : undefined,
        userId: filter.userId ? (filter.userId as any) : undefined,
      },
      relations: { user: true },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.mediaRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    return result;
  }

  async deleteById(id: number) {
    const result = await this.mediaRepo.delete(id);
    return result.affected;
  }
}
