import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('wallets')
export class WalletsProcessor {
  @Process('create-transaction')
  async createTransaction(job: Job<any>) {
    // const payload = job.data;
    console.log('Wallet received invoices.paid');
  }
}
