import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { InvoiceFiltersDto } from './dto/invoice-filter.dto';
import { InvoiceService } from './invoice.service';

@Controller('finances/invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly midtransService: MidtransService,
  ) {}

  @Get()
  async findByQuery(@Body() filter: InvoiceFiltersDto) {
    return this.invoiceService.findByQuery(filter);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.invoiceService.findById(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.invoiceService.findByCode(code);
  }

  @Post(':id/pay')
  async pay(@Param('id') id: number) {
    const invoice = await this.invoiceService.findById(id);
    if (!invoice) throw new NotFoundException();
    if (invoice.status !== 'unpaid') throw new BadRequestException();
    const params = {
      transaction_details: {
        order_id: invoice.id,
        gross_amount: 100000,
      },
    };
    const payment = await this.midtransService.snap.createTransaction(params);

    return {
      data: { invoice, payment },
    };
  }
}
