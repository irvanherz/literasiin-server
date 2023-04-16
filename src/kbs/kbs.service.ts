import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateKbDto, KbFilterDto, UpdateKbDto } from './dto/kbs.dto';
import { Kb } from './entities/kb.entity';

@Injectable()
export class KbsService {
  constructor(
    @InjectRepository(Kb)
    private kbsRepository: Repository<Kb>,
  ) {}

  async create(createKbDto: CreateKbDto) {
    const kb = this.kbsRepository.create(createKbDto);
    return await this.kbsRepository.save(kb);
  }

  async findMany(filter: KbFilterDto) {
    const take = filter.limit;
    const skip = (filter.page - 1) * take;
    const result = await this.kbsRepository.findAndCount({
      where: {
        title: filter.search ? Like(`%${filter.search}%`) : undefined,
        categoryId: filter.categoryId || undefined,
        status: (filter.status as any) || undefined,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.kbsRepository.findOne({
      where: { id },
    });
    return result;
  }

  async updateById(id: number, payload: UpdateKbDto) {
    const result = await this.kbsRepository.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.kbsRepository.delete(id);
    return result.affected;
  }
}
