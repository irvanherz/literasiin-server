import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { BulkUpdateCategoryEntryDto } from './dto/bulk-update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { StoryCategoryFiltersDto } from './dto/story-category-filters.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StoryCategory } from './entities/story-category.entity';

@Injectable()
export class StoryCategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(StoryCategory)
    private categoriesRepository: Repository<StoryCategory>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async findMany(filters: StoryCategoryFiltersDto) {
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

  async updateById(id: number, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoriesRepository.update(
      id,
      updateCategoryDto,
    );
    return result.affected;
  }

  async bulkUpdate(payload: BulkUpdateCategoryEntryDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let ok = false;
    try {
      for await (const category of payload) {
        await queryRunner.manager.update(StoryCategory, category.id, category);
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
