import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { Identity } from './entities/identity.entity';

type FindManyParams = {
  userId?: number;
  type?: string;
};

type FindOneParams = FindManyParams;

@Injectable()
export class IdentitiesService {
  constructor(
    @InjectRepository(Identity)
    private identitiesRepository: Repository<Identity>,
  ) {}

  async create(data: CreateIdentityDto) {
    const identity = this.identitiesRepository.create(data);
    const result = await this.identitiesRepository.save(identity);
    return result;
  }

  async findMany(params?: FindManyParams) {
    const result = await this.identitiesRepository.findAndCount({
      where: {
        userId: params?.userId || undefined,
        type: params?.type || undefined,
      },
    });
    return result;
  }

  async findOne(params?: FindOneParams) {
    const result = await this.identitiesRepository.findOne({
      where: {
        userId: params?.userId || undefined,
        type: params?.type || undefined,
      },
    });
    return result;
  }

  async findById(id: number) {
    const result = this.identitiesRepository.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, data: UpdateIdentityDto) {
    const result = await this.identitiesRepository.update(id, data);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.identitiesRepository.softDelete(id);
    return result.affected;
  }
}
