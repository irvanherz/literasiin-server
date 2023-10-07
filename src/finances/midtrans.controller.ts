import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { PaymentsService } from './payments.service';

@Controller('finances/midtrans')
export class MidtransController {
  constructor(
    private midtransService: MidtransService,
    private readonly paymentsService: PaymentsService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Post('webhooks/notification')
  async notification(@Req() req: RawBodyRequest<Request>) {
    const json = req.rawBody.toString();
    const statusResponse =
      await this.midtransService.snap.transaction.notification(json);
    const paymentCode = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const payment = await this.paymentsService.findById(paymentCode);
    if (payment.status === transactionStatus) return 'OK';

    // Sample transactionStatus handling logic
    let updatedPayment = null;

    if (transactionStatus == 'capture') {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraudStatus == 'challenge') {
        // TODO set transaction status on your databaase to 'challenge'
        payment.status = 'challenge';
        updatedPayment = await this.paymentsService.save(payment);
      } else if (fraudStatus == 'accept') {
        // TODO set transaction status on your databaase to 'success'
        payment.status = 'paid';
        updatedPayment = await this.paymentsService.save(payment);
      }
    } else if (transactionStatus == 'settlement') {
      // TODO set transaction status on your databaase to 'success'
      payment.status = 'paid';
      updatedPayment = await this.paymentsService.save(payment);
    } else if (transactionStatus == 'deny') {
      // TODO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {
      // TODO set transaction status on your databaase to 'failure'
      payment.status = 'failed';
      updatedPayment = await this.paymentsService.save(payment);
    } else if (transactionStatus == 'pending') {
      // TODO set transaction status on your databaase to 'pending' / waiting payment
      payment.status = 'pending';
      updatedPayment = await this.paymentsService.save(payment);
    }

    this.amqpConnection.publish('finances.payments.updated', '', {
      payment: updatedPayment,
    });

    return 'OK';
  }
  @Post('webhooks/notification-test')
  async notificationTest() {
    // this.invoicesQueue.add('paid', 'data');
  }
}
