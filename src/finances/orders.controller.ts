import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { OrderFilterDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';
import { PaymentsService } from './payments.service';

@Controller('finances/orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly midtransService: MidtransService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByQuery(@Body() filter: OrderFilterDto, @User() currentUser) {
    filter.userId = sanitizeFilter(filter.userId, { currentUser });
    const [data, numItems] = await this.ordersService.findByQuery(filter);
    const meta = { numItems };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.ordersService.findById(id);
  }

  @Post(':id/pay')
  async pay(@Param('id') id: number) {
    let order = await this.ordersService.findById(id);
    if (!order) throw new NotFoundException();
    if (order.paymentId) {
      return {
        data: order.payment,
      };
    }
    let payment = await this.paymentsService.save({
      amount: order.amount,
      code: Date.now().toString(),
    });
    //
    const params = {
      transaction_details: {
        order_id: payment.id,
        gross_amount: +payment.amount,
      },
    };
    const meta = await this.midtransService.snap.createTransaction(params);
    //
    payment.meta = meta;
    payment = await this.paymentsService.save(payment);
    order.paymentId = payment.id;
    order = await this.ordersService.save(order);
    return {
      data: payment,
    };
  }
}
