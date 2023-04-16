import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { OrdersService } from 'src/finances/orders.service';
import { sanitizeFilter } from 'src/libs/validations';
import { WalletDepositDto, WalletFilterDto } from './dto/wallets.dto';
import { WalletsService } from './wallets.service';

const COIN_PRICE = 1000;

@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly ordersService: OrdersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByQuery(@Query() filter: WalletFilterDto, @User() currentUser) {
    filter.userId = sanitizeFilter(filter.userId, { currentUser });

    if (
      (filter.userId == undefined || filter.userId !== currentUser.id) &&
      currentUser.role !== 'admin'
    )
      throw new BadRequestException();

    const [wallets, count] = await this.walletsService.findByQuery(filter);
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

  @UseGuards(JwtAuthGuard)
  @Post(':walletId/deposit-order')
  async createDepositOrder(
    @Body() payload: WalletDepositDto,
    @User() currentUser,
  ) {
    const wallet = await this.walletsService.findUserCoinWallet(currentUser.id);

    const qtyCoins = payload.amount;
    const amountIdr = qtyCoins * COIN_PRICE;
    const feeIdr = 10000;
    const finalAmount = amountIdr + feeIdr;

    if (!wallet) throw new BadRequestException();
    const order = await this.ordersService.createWithDetails(
      {
        userId: wallet.userId,
        amount: finalAmount,
      },
      [
        {
          qty: qtyCoins,
          type: 'coin',
          meta: { id: wallet.id, name: 'DEPOSIT', price: COIN_PRICE },
          amount: amountIdr,
        },
        {
          qty: 1,
          type: 'fee',
          meta: { id: null, name: 'FEE', price: feeIdr },
          amount: feeIdr,
        },
      ],
    );

    return { data: order };
  }
}
