import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletFilterDto } from './dto/wallet-filter';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepo: Repository<Wallet>,
  ) {}

  async findByQuery(filter: WalletFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = this.walletsRepo.findAndCount({
      where: {
        userId: filter.userId ? Number(filter.userId) : undefined,
      },
      relations: {
        user: true,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    if (!id) throw new BadRequestException();
    const result = this.walletsRepo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    return result;
  }

  async findUserCoinWallet(userId: number) {
    if (!userId) throw new BadRequestException();
    const result = await this.walletsRepo.findOne({
      where: { userId },
      relations: {
        user: true,
      },
    });
    return result;
  }
}
