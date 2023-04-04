import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { WalletTransactionFilter } from './dto/wallet-transaction-filter.dto';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletsService } from './wallets.service';

@Controller()
export class WalletTransactiosController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly trxService: WalletTransactionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('wallets/transactions')
  async findByQuery(
    @Query() filter: WalletTransactionFilter,
    @User() currentUser,
  ) {
    filter.walletId = sanitizeFilter(filter.walletId);

    if (filter.walletId === undefined && currentUser.role !== 'admin')
      throw new BadRequestException();

    if (filter.walletId) {
      const wallet = await this.walletsService.findById(filter.walletId as any);
      if (wallet?.userId !== currentUser?.id && currentUser?.role !== 'admin')
        throw new BadRequestException();
    }

    const [wallets, count] = await this.trxService.findByQuery(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };

    return {
      data: wallets,
      meta,
    };
  }
}
