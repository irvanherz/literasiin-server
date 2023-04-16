import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
  ) {}

  async create(payload: Partial<Payment>) {
    const result = await this.paymentsRepo.save(payload);
    return result;
  }

  async findById(id: number) {
    if (!id) throw new BadRequestException();
    const result = this.paymentsRepo.findOne({
      where: { id },
    });
    return result;
  }

  async findByCode(code: string) {
    if (!code) throw new BadRequestException();
    const result = this.paymentsRepo.findOne({
      where: { code },
    });
    return result;
  }

  async save(payment: Partial<Payment>) {
    const result = await this.paymentsRepo.save(payment);
    return result;
  }
}
