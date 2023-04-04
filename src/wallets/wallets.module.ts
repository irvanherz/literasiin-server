import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Wallet } from './entities/wallet.entity';
import { WalletTransactiosController } from './wallet-transactions.controller';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
    BullModule.registerQueue({
      name: 'wallets',
    }),
  ],
  controllers: [WalletTransactiosController, WalletsController],
  providers: [WalletsService, WalletTransactionsService, Wallet],
})
export class WalletsModule {}
