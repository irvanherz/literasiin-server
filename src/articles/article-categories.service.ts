import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BulkUpdateCategoryEntryDto } from './dto/bulk-update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ArticleCategory } from './entities/article-category.entity';

@Injectable()
export class ArticleCategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(ArticleCategory)
    private categoriesRepo: Repository<ArticleCategory>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepo.create(createCategoryDto);
    return await this.categoriesRepo.save(category);
  }

  async findMany() {
    const result = await this.categoriesRepo.findAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.categoriesRepo.findOne({ where: { id } });
    return result;
  }

  async updateById(id: number, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoriesRepo.update(id, updateCategoryDto);
    return result.affected;
  }

  async bulkUpdate(payload: BulkUpdateCategoryEntryDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for await (const category of payload) {
        await queryRunner.manager.update(
          ArticleCategory,
          category.id,
          category,
        );
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async deleteById(id: number) {
    const result = await this.categoriesRepo.delete(id);
    return result.affected;
  }
}
