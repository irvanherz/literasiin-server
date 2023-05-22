import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { PublicationsService } from './publications.service';

@Injectable()
export class FinancesSubscriber {
  constructor(private readonly publicationsService: PublicationsService) {}
  @RabbitSubscribe({
    exchange: 'finances.orders.items.paid',
    routingKey: '',
  })
  public async handleOrderItemPaid(payload: any) {
    try {
      const { item } = payload;
      if (item.type === 'publication') {
        const pubId = item.meta.id;
        this.publicationsService.updateById(pubId, { status: 'publishing' });
      }
    } catch (err) {
      console.log(err);
    }
  }

  @RabbitSubscribe({
    exchange: 'finances.orders.items.failed',
    routingKey: '',
  })
  public async handleOrderItemFailed(payload: any) {
    try {
      const { item } = payload;
      if (item.type === 'publication') {
        const pubId = item.meta.id;
        this.publicationsService.updateById(pubId, { status: 'draft' });
      }
    } catch (err) {
      console.log(err);
    }
  }

  @RabbitSubscribe({
    exchange: 'finances.orders.items.canceled',
    routingKey: '',
  })
  public async handleOrderItemCanceled(payload: any) {
    try {
      const { item } = payload;
      if (item.type === 'publication') {
        const pubId = item.meta.id;
        this.publicationsService.updateById(pubId, { status: 'draft' });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
