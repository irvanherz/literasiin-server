import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PushNotificationsService } from './push-notifications.service';

@Processor('PushNotifications')
export class PushNotificationsProcessor {
  constructor(private readonly pushNotifService: PushNotificationsService) {}

  @Process('sendMulticast')
  async send(job: Job<any>) {
    const payload = job.data;
    const { tokens, message } = payload;
    await this.pushNotifService.sendMulticast(tokens, message);
  }
}
