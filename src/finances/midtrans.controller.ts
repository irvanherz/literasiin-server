import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { WalletTransactionsService } from 'src/wallets/wallet-transactions.service';
import { Invoice } from './entities/invoice.entity';
import { InvoicesService } from './invoices.service';

@Controller('finances/midtrans')
export class MidtransController {
  constructor(
    private midtransService: MidtransService,
    private readonly invoiceService: InvoicesService,
    private readonly walletTrxService: WalletTransactionsService,
  ) {}

  private async handlePaid(invoice: Invoice, payload: any) {
    try {
      invoice.status = 'paid';
      await this.invoiceService.save(invoice);
      if (invoice.type === 'deposit') {
        this.walletTrxService.create({
          walletId: invoice.meta.walletId,
          amount: +payload.gross_amount,
          description: 'Deposit',
        });
      }
    } catch (err) {
      console.log('ERRR');
    }
  }

  @Post('webhooks/notification')
  async notification(@Req() req: RawBodyRequest<Request>) {
    const json = req.rawBody.toString();
    const statusResponse =
      await this.midtransService.snap.transaction.notification(json);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`,
    );

    const invoice = await this.invoiceService.findById(orderId);

    // Sample transactionStatus handling logic

    if (transactionStatus == 'capture') {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraudStatus == 'challenge') {
        // TODO set transaction status on your databaase to 'challenge'
        invoice.status = 'challenge';
        await this.invoiceService.save(invoice);
      } else if (fraudStatus == 'accept') {
        // TODO set transaction status on your databaase to 'success'
        this.handlePaid(invoice, statusResponse);
      }
    } else if (transactionStatus == 'settlement') {
      // TODO set transaction status on your databaase to 'success'
      this.handlePaid(invoice, statusResponse);
    } else if (transactionStatus == 'deny') {
      // TODO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {
      // TODO set transaction status on your databaase to 'failure'
      invoice.status = 'failed';
      await this.invoiceService.save(invoice);
    } else if (transactionStatus == 'pending') {
      // TODO set transaction status on your databaase to 'pending' / waiting payment
      invoice.status = 'pending';
      await this.invoiceService.save(invoice);
    }

    return 'OK';
  }
  @Post('webhooks/notification-test')
  async notificationTest() {
    // this.invoicesQueue.add('paid', 'data');
  }
}
