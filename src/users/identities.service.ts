import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { IdentityFiltersDto } from './dto/identity-filters.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { Identity } from './entities/identity.entity';

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

  async findMany(filters?: IdentityFiltersDto) {
    const result = await this.identitiesRepository.findAndCount({
      where: {
        userId: filters?.userId || undefined,
        type: filters?.type || undefined,
      },
    });
    result[0] = result[0].map((identity) => {
      if (identity.type === 'email') identity.key = '<encrypted>';
      return identity;
    });
    return result;
  }

  async findOne(params?: IdentityFiltersDto) {
    const result = await this.identitiesRepository.findOne({
      where: {
        userId: params?.userId || undefined,
        type: params?.type || undefined,
      },
    });
    if (result && result.type === 'email') result.key = '<encrypted>';
    return result;
  }

  async findById(id: number) {
    const result = await this.identitiesRepository.findOne({ where: { id } });
    if (result && result.type === 'email') result.key = '<encrypted>';
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
