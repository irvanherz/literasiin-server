import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { WalletsService } from 'src/wallets/wallets.service';
import { CreateCoinDepositDto } from './dto/create-coin-deposit.dto';
import { InvoicesService } from './invoices.service';

@Controller('finances')
export class FinancesController {
  constructor(
    private readonly invoiceService: InvoicesService,
    private readonly walletService: WalletsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('deposit-coin')
  async createCoinDeposit(
    @Body() payload: CreateCoinDepositDto,
    @User() currentUser,
  ) {
    const wallet = await this.walletService.findUserCoinWallet(currentUser.id);
    if (!wallet) throw new BadRequestException();
    const invoice = await this.invoiceService.create({
      type: 'deposit',
      amount: payload.amount,
      userId: currentUser.id,
      meta: {
        walletId: wallet.id,
      },
    });
    return { data: invoice };
  }
}
