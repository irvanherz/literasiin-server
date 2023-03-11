import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletTransactionsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wallet)
    private walletsRepo: Repository<Wallet>,
  ) {}

  async create(payload: Partial<WalletTransaction>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      payload.type = payload.amount >= 0 ? 'C' : 'D';
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { id: payload.walletId },
      });
      if (!wallet) throw new BadRequestException();
      // check balance
      wallet.balance = +wallet.balance + payload.amount;
      if (wallet.balance < 0) throw new BadRequestException();
      // insert trx and update wallet
      payload.finalBalance = wallet.balance;
      const createdTransaction = await queryRunner.manager.insert(
        WalletTransaction,
        payload,
      );
      await queryRunner.manager.update(Wallet, wallet.id, wallet);
      await queryRunner.commitTransaction();
      return createdTransaction;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    throw new BadRequestException();
  }
}
