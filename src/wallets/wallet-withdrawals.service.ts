import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { WalletWithdrawalFilter } from './dto/wallets.dto';
import { WalletWithdrawal } from './entities/wallet-withdrawal.entity';

@Injectable()
export class WalletWithdrawalsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(WalletWithdrawal)
    private readonly withdrawalsRepo: Repository<WalletWithdrawal>,
  ) {}

  async create(payload: Partial<WalletWithdrawal>) {
    const result = await this.withdrawalsRepo.save(payload);
    return result;
  }

  async save(payload: WalletWithdrawal) {
    const result = await this.withdrawalsRepo.save(payload);
    return result;
  }

  async findLastWithdrawalByWalletId(walletId: number) {
    const result = await this.withdrawalsRepo.findOne({
      where: { walletId },
      order: { createdAt: 'desc' },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.withdrawalsRepo.findOne({
      where: { id },
    });
    return result;
  }

  async findByQuery(filter: WalletWithdrawalFilter = {}) {
    const take = filter.limit || 1;
    const skip = ((filter.page || 1) - 1) * take;
    const result = await this.withdrawalsRepo.findAndCount({
      where: {
        walletId: (filter?.walletId || undefined) as any,
      },
      relations: {
        wallet: true,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }
}
