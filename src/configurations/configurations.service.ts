import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ConfigurationFiltersDto } from './dto/configuration-filters.dto';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { Configuration } from './entities/configuration.entity';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configRepo: Repository<Configuration>,
  ) {}
  async create(payload: CreateConfigurationDto) {
    const config = this.configRepo.create(payload);
    const result = await await this.configRepo.save(config);
    return result;
  }

  async findByQuery(filters: ConfigurationFiltersDto) {
    const take = filters.limit;
    const skip = (filters.page - 1) * take;
    const result = await this.configRepo.findAndCount({
      where: filters.search
        ? [
            { name: ILike(`%${filters.search}%`) },
            { description: ILike(`%${filters.search}%`) },
          ]
        : {},
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.configRepo.findOne({ where: { id } });
    return result;
  }

  async findByName(name: string) {
    const result = await this.configRepo.findOne({ where: { name } });
    return result;
  }

  async updateById(id: number, payload: UpdateConfigurationDto) {
    const result = await this.configRepo.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.configRepo.delete(id);
    return result.affected;
  }
}
