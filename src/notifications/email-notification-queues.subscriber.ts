import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { MailsService } from './mails.service';

@Injectable()
export class EmailNotificationQueuesSubscriber {
  constructor(private readonly mailsService: MailsService) {}
  @RabbitSubscribe({
    exchange: 'notifications.emails.queues',
    routingKey: '',
  })
  public async handleQueueSendEmail(payload: any) {
    try {
      this.mailsService.send(payload.email);
    } catch (err) {
      console.log(err);
    }
  }
}
