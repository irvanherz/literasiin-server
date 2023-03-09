import { Body, Controller, Post } from '@nestjs/common';
import { CreateCoinDepositDto } from './dto/create-coin-deposit.dto';
import { InvoiceService } from './invoice.service';

@Controller('finances')
export class FinancesController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('deposit-coin')
  async createCoinDeposit(@Body() payload: CreateCoinDepositDto) {
    const invoice = await this.invoiceService.create({
      amount: payload.amount,
      userId: payload.userId,
      meta: {
        type: 'deposit-coin',
      },
    });
    return { data: invoice };
  }
}
