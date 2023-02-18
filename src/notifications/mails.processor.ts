import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailsService } from './mails.service';

@Processor('mails')
export class MailsProcessor {
  constructor(private readonly mailsService: MailsService) {}

  @Process('send')
  async send(job: Job<any>) {
    const payload = job.data;
    await this.mailsService.send(payload);
  }
}
