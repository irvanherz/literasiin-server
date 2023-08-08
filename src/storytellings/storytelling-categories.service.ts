import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import {
  BulkUpdateStorytellingCategoryEntryDto,
  StorytellingCategoryFilter,
} from './dto/storytelling-categories.dto';
import { StorytellingCategory } from './entities/storytelling-category.entity';

@Injectable()
export class StorytellingCategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(StorytellingCategory)
    private categoriesRepository: Repository<StorytellingCategory>,
  ) {}

  async create(payload: Partial<StorytellingCategory>) {
    const category = this.categoriesRepository.create(payload);
    return await this.categoriesRepository.save(category);
  }

  async findMany(filters: StorytellingCategoryFilter) {
    const take = filters.limit || 1;
    const skip = (filters.page - 1) * take;
    const result = await this.categoriesRepository.findAndCount({
      where: {
        name: filters?.search ? ILike(`%${filters.search}%`) : undefined,
      },
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.categoriesRepository.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, payload: Partial<StorytellingCategory>) {
    const result = await this.categoriesRepository.update(id, payload);
    return result.affected;
  }

  async bulkUpdate(payload: BulkUpdateStorytellingCategoryEntryDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let ok = false;
    try {
      for await (const category of payload) {
        await queryRunner.manager.update(
          StorytellingCategory,
          category.id,
          category,
        );
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
  }

  async deleteById(id: number) {
    const result = await this.categoriesRepository.delete(id);
    return result.affected;
  }
}
