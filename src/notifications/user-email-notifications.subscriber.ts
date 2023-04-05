import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class UserEmailNotificationsSubscriber {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: 'users.created',
    routingKey: '',
  })
  public async handleUserCreated(payload: any) {
    const { user } = payload;
    try {
      this.amqpConnection.publish('notifications.emails.queues', '', {
        email: {
          to: user.email,
          html: `Hai ${user.fullName}. Selamat datang di Literasiin.`,
          subject: 'Selamat Datang di Literasiin',
          text: `Hai ${user.fullName}. Selamat datang di Literasiin.`,
        } as SendMailDto,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
