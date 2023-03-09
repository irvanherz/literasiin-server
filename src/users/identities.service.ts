import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
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

  async create(payload: CreateIdentityDto) {
    if (payload.type === 'password') {
      payload.key = await bcrypt.hash(payload.key, 5);
    }
    const identity = this.identitiesRepository.create(payload);
    const result = await this.identitiesRepository.save(identity);
    if (identity.type === 'password') identity.key = '<encrypted>';
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
      if (identity.type === 'password') identity.key = '<encrypted>';
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
    if (result && result.type === 'password') result.key = '<encrypted>';
    return result;
  }

  async findById(id: number) {
    const result = await this.identitiesRepository.findOne({ where: { id } });
    if (result && result.type === 'password') result.key = '<encrypted>';
    return result;
  }

  async updateById(id: number, data: UpdateIdentityDto) {
    const result = await this.identitiesRepository.update(id, data);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.identitiesRepository.delete(id);
    return result.affected;
  }
}
