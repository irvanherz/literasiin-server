import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedRabbitMQModule } from 'src/shared-rabbitmq/shared-rabbitmq.module';
import { User } from 'src/users/entities/user.entity';
import { WalletTransaction } from 'src/wallets/entities/wallet-transaction.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { FinancesController } from './finances.controller';
import { FinancesSubscriber } from './finances.subscriber';
import { MidtransController } from './midtrans.controller';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Wallet,
      WalletTransaction,
      User,
      Payment,
    ]),
    SharedRabbitMQModule,
  ],
  controllers: [FinancesController, OrdersController, MidtransController],
  providers: [OrdersService, PaymentsService, FinancesSubscriber],
})
export class FinancesModule {}
