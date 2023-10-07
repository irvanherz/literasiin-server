import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import {
  CreateWalletWithdrawalDto,
  UpdateWalletWithdrawalDto,
  WalletWithdrawalFilter,
} from './dto/wallets.dto';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletWithdrawalsService } from './wallet-withdrawals.service';
import { WalletsService } from './wallets.service';

@Controller()
export class WalletWithdrawalsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly withdrawalsSvc: WalletWithdrawalsService,
    private readonly walletTrxSvc: WalletTransactionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('wallets/withdrawals')
  async create(
    @Body() payload: CreateWalletWithdrawalDto,
    @User() currentUser,
  ) {
    const wallet = await this.walletsService.findById(payload.walletId);
    if (!wallet) throw new NotFoundException();

    if (wallet.userId !== currentUser.id && currentUser.role !== 'admin')
      throw new BadRequestException();
    const lastRequest = await this.withdrawalsSvc.findLastWithdrawalByWalletId(
      wallet.id,
    );
    if (
      lastRequest?.status === 'requested' ||
      lastRequest?.status === 'processing'
    )
      throw new BadRequestException();
    if (+wallet.balance < payload.amount) throw new BadRequestException();
    const data = await this.withdrawalsSvc.create(payload);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallets/withdrawals/:id')
  async findById(@Param('id') id: number, @User() currentUser) {
    const withdrawal = await this.withdrawalsSvc.findById(id);
    if (!withdrawal) throw new NotFoundException();
    const wallet = await this.walletsService.findById(withdrawal.walletId);
    if (wallet?.userId !== currentUser.id && currentUser.role !== 'admin')
      throw new BadRequestException();
    return { data: withdrawal };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('wallets/withdrawals/:id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateWalletWithdrawalDto,
    @User() currentUser,
  ) {
    const withdrawal = await this.withdrawalsSvc.findById(id);
    if (!withdrawal) throw new NotFoundException();
    const wallet = await this.walletsService.findById(withdrawal.walletId);
    if (wallet?.userId !== currentUser.id && currentUser.role !== 'admin')
      throw new BadRequestException();
    if (payload.status !== 'canceled' && currentUser?.role !== 'admin')
      throw new BadRequestException();

    withdrawal.status = payload.status;
    await this.withdrawalsSvc.save(withdrawal);

    if (withdrawal.status === 'completed') {
      await this.walletTrxSvc.create({
        walletId: wallet.id,
        amount: -withdrawal.amount,
        description: 'Withdrawal',
      });
    }

    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallets/withdrawals')
  async findByQuery(
    @Query() filter: WalletWithdrawalFilter,
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

    const [wallets, count] = await this.withdrawalsSvc.findByQuery(filter);
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
