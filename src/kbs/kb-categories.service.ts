import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { BulkUpdateKbCategoryEntryDto } from './dto/bulk-update-kb-category.dto';
import { CreateKbCategoryDto } from './dto/create-kb-category.dto';
import { KbCategoryFilterDto } from './dto/kb-category-filter.dto';
import { UpdateKbCategoryDto } from './dto/update-kb-category.dto';
import { KbCategory } from './entities/kb-category.entity';

@Injectable()
export class KbCategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(KbCategory)
    private categoriesRepo: Repository<KbCategory>,
  ) {}

  async create(payload: CreateKbCategoryDto) {
    const category = this.categoriesRepo.create(payload);
    return await this.categoriesRepo.save(category);
  }

  async findMany(filter: KbCategoryFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = await this.categoriesRepo.findAndCount({
      where: {
        name: filter?.search ? ILike(`${filter.search}`) : undefined,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.categoriesRepo.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, payload: UpdateKbCategoryDto) {
    const result = await this.categoriesRepo.update(id, payload);
    return result.affected;
  }

  async bulkUpdate(payload: BulkUpdateKbCategoryEntryDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let ok = false;
    try {
      for await (const category of payload) {
        await queryRunner.manager.update(KbCategory, category.id, category);
      }
      await queryRunner.commitTransaction();
      ok = true;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    if (!ok) throw new BadRequestException();
    return true;
  }

  async deleteById(id: number) {
    const result = await this.categoriesRepo.delete(id);
    return result.affected;
  }
}
