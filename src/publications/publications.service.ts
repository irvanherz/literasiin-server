import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
  ) {}

  async create(payload: Partial<Publication>) {
    const user = this.publicationsRepository.create(payload);
    const result = await this.publicationsRepository.save(user);
    return result;
  }

  async findMany(filter: any = {}) {
    const result = this.publicationsRepository.findAndCount({});
    return result;
  }

  async findById(id: number) {
    const result = this.publicationsRepository.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, payload: Partial<Publication>) {
    const result = await this.publicationsRepository.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.publicationsRepository.softDelete(id);
    return result.affected;
  }
}
