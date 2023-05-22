import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    private readonly amqpConnection: AmqpConnection,
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

  @Cron('* * * * *')
  async handleAutoExpire() {
    console.log('[SCHEDULER] Expiring unpaid payment');

    const unpaidPayments = await this.paymentsRepo.find({
      where: {
        status: 'unpaid',
        expiredAt: LessThan(new Date()),
      },
    });
    for (const payment of unpaidPayments) {
      payment.status = 'canceled';
      const updatedPayment = await this.paymentsRepo.save(payment);
      this.amqpConnection.publish('finances.payments.updated', '', {
        payment: updatedPayment,
      });
    }
  }
}
