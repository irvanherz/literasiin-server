import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Injectable()
export class FinancesSubscriber {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  @RabbitSubscribe({
    exchange: 'finances.payments.updated',
    routingKey: '',
  })
  public async handlePaymentUpdated(payload: any) {
    console.log('Paid');
    try {
      const { payment } = payload;
      if (payment.status === 'paid') {
        const items = await this.ordersService.findOrderItemsByPaymentId(
          payment.id,
        );
        for (const item of items) {
          this.amqpConnection.publish('finances.orders.items.paid', '', {
            item,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
