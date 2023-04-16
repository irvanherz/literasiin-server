import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderFilterDto } from './dto/orders.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepo: Repository<OrderItem>,
    private readonly dataSource: DataSource,
  ) {}

  async create(payload: Partial<Order>) {
    const setData = this.ordersRepo.create(payload);
    let order = await this.ordersRepo.save(setData);
    order = await this.ordersRepo.save(order);
    return order;
  }

  async createWithDetails(
    setOrder: Partial<Order>,
    setItems: Partial<OrderItem>[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const orderP = queryRunner.manager.create(Order, setOrder);
      const order = await queryRunner.manager.save(orderP);
      for await (const setItem of setItems) {
        const itemP = queryRunner.manager.create(OrderItem, setItem);
        itemP.orderId = order.id;
        await queryRunner.manager.save(itemP);
      }
      await queryRunner.commitTransaction();
      return order;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async createPayment(order: Order, meta: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const items = await queryRunner.manager.find(OrderItem, {
        where: { orderId: order.id },
      });
      const paymentAmount = items.reduce((a, c) => a + Number(c.amount), 0);
      const paymentP = queryRunner.manager.create(Payment, {
        code: Date.now().toString(),
        amount: paymentAmount,
        meta,
      });
      const payment = await queryRunner.manager.save(paymentP);
      order.paymentId = payment.id;
      order.amount = paymentAmount;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return payment;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async findByQuery(filter: OrderFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = this.ordersRepo.findAndCount({
      where: {
        userId: (filter.userId || undefined) as any,
        payment: filter.status ? { status: filter.status as any } : undefined,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    if (!id) throw new BadRequestException();
    const result = this.ordersRepo.findOne({
      where: { id },
    });
    return result;
  }

  async findOrderItemsByPaymentId(id: number) {
    if (!id) throw new BadRequestException();
    const result = this.orderItemsRepo.find({
      where: { order: { paymentId: id } },
    });
    return result;
  }

  async save(order: Order) {
    const result = await this.ordersRepo.save(order);
    return result;
  }
}
