import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { WalletTransactionsService } from './wallet-transactions.service';

@Injectable()
export class FinancesSubscriber {
  constructor(private readonly walletTrxService: WalletTransactionsService) {}
  @RabbitSubscribe({
    exchange: 'finances.orders.items.paid',
    routingKey: '',
  })
  public async handleOrderItemPaid(payload: any) {
    try {
      const { item } = payload;
      console.log(item);
      if (item.type === 'coin') {
        this.walletTrxService.create({
          walletId: item.meta.id,
          amount: +item.qty,
          description: 'Deposit',
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
