import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from 'src/finances/entities/order-item.entity';
import { Order } from 'src/finances/entities/order.entity';
import { FinancesModule } from 'src/finances/finances.module';
import { OrdersService } from 'src/finances/orders.service';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { WalletWithdrawal } from './entities/wallet-withdrawal.entity';
import { Wallet } from './entities/wallet.entity';
import { FinancesSubscriber } from './finances.subscriber';
import { WalletTransactiosController } from './wallet-transactions.controller';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletWithdrawalsController } from './wallet-withdrawals.controller';
import { WalletWithdrawalsService } from './wallet-withdrawals.service';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet,
      WalletTransaction,
      WalletWithdrawal,
      Order,
      OrderItem,
    ]),
    FinancesModule,
  ],
  controllers: [
    WalletTransactiosController,
    WalletWithdrawalsController,
    WalletsController,
  ],
  providers: [
    WalletsService,
    WalletTransactionsService,
    Wallet,
    OrdersService,
    FinancesSubscriber,
    WalletWithdrawalsService,
  ],
  exports: [
    WalletsService,
    WalletTransactionsService,
    WalletWithdrawalsService,
    Wallet,
  ],
})
export class WalletsModule {}
