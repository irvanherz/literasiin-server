import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WalletTransaction } from 'src/wallets/entities/wallet-transaction.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { WalletTransactionsService } from 'src/wallets/wallet-transactions.service';
import { WalletsModule } from 'src/wallets/wallets.module';
import { WalletsService } from 'src/wallets/wallets.service';
import { Invoice } from './entities/invoice.entity';
import { FinancesController } from './finances.controller';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MidtransController } from './midtrans.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Wallet, WalletTransaction, User]),
    WalletsModule,
  ],
  controllers: [FinancesController, InvoicesController, MidtransController],
  providers: [InvoicesService, WalletsService, WalletTransactionsService],
})
export class FinancesModule {}
