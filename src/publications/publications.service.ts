import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { Publication } from './entities/publication.entity';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
  ) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const user = this.publicationsRepository.create(createPublicationDto);
    const result = await this.publicationsRepository.save(user);
    return result;
  }

  async findMany(filters: any = {}) {
    const result = this.publicationsRepository.findAndCount({});
    return result;
  }

  async findById(id: number) {
    const result = this.publicationsRepository.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, updatePublicationDto: UpdatePublicationDto) {
    const result = await this.publicationsRepository.update(
      id,
      updatePublicationDto,
    );
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.publicationsRepository.softDelete(id);
    return result.affected;
  }
}
