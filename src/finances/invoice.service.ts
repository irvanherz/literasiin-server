import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceFiltersDto } from './dto/invoice-filter.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  async create(payload: CreateInvoiceDto) {
    const setData = this.invoiceRepo.create(payload);
    setData.code = '';
    let invoice = await this.invoiceRepo.save(setData);
    invoice.code = `INV/${moment().format('YYYYMMDD')}/${invoice.id}`;
    invoice = await this.invoiceRepo.save(invoice);
    return invoice;
  }

  async findByQuery(filter: InvoiceFiltersDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = this.invoiceRepo.findAndCount({
      where: {
        code: filter.search ? (filter.search as any) : undefined,
        status: filter.status ? (filter.status as any) : undefined,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    if (!id) throw new BadRequestException();
    const result = this.invoiceRepo.findOne({
      where: { id },
    });
    return result;
  }

  async findByCode(code: string) {
    if (!code) throw new BadRequestException();
    const result = this.invoiceRepo.findOne({
      where: { code },
    });
    return result;
  }

  async save(invoice: Invoice) {
    const result = await this.invoiceRepo.save(invoice);
    return result;
  }
}
