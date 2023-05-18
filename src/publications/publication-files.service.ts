import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/media/entities/media.entity';
import { Repository } from 'typeorm';
import { PublicationFileFilterDto } from './dto/publication-files.dto';
import { PublicationFile } from './entities/publication-file';

@Injectable()
export class PublicationFilesService {
  constructor(
    @InjectRepository(Media)
    private mediaRepo: Repository<Media>,
    @InjectRepository(PublicationFile)
    private publicationFilesRepo: Repository<PublicationFile>,
  ) {}

  async create(payload: Partial<PublicationFile>) {
    const result = await this.publicationFilesRepo.save(payload);
    return result;
  }

  async findMany(filter: PublicationFileFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = await this.publicationFilesRepo.findAndCount({
      where: {
        publicationId: filter?.publicationId ? filter.publicationId : undefined,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });

    return result;
  }
  async deleteById(id: number) {
    const result = await this.publicationFilesRepo.delete(id);
    return result.affected;
  }
}
