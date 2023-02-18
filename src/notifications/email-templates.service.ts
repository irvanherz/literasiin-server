import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { EmailTemplateFiltersDto } from './dto/email-template-filters.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';
import { EmailTemplate } from './entities/email-template.entity';
@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private templatesRepo: Repository<EmailTemplate>,
  ) {}

  async create(payload: CreateEmailTemplateDto) {
    const user = this.templatesRepo.create(payload);
    const result = await this.templatesRepo.save(user);
    return result;
  }

  async findMany(filters: EmailTemplateFiltersDto) {
    const take = filters.limit || 1;
    const skip = (filters.page - 1) * take;
    const result = this.templatesRepo.findAndCount({
      where: {
        name: filters.search ? Like(`%${filters.search}%`) : undefined,
      },
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = this.templatesRepo.findOne({ where: { id } });
    return result;
  }

  async findByName(name: string) {
    const result = this.templatesRepo.findOne({ where: { name } });
    return result;
  }

  async updateById(id: number, data: UpdateEmailTemplateDto) {
    const result = await this.templatesRepo.update(id, data);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.templatesRepo.softDelete(id);
    return result.affected;
  }
}
