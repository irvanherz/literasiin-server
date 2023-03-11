import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Wallet } from './entities/wallet.entity';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
    BullModule.registerQueue({
      name: 'wallets',
    }),
  ],
  controllers: [WalletsController],
  providers: [WalletsService, Wallet],
})
export class WalletsModule {}
