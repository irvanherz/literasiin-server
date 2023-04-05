import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class UserEmailNotificationsSubscriber {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
  ) {}

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

  @RabbitSubscribe({
    exchange: 'users.passwordResetTokens.created',
    routingKey: '',
  })
  public async handlePasswordResetTokenCreated(payload: any) {
    const { user, prt } = payload;
    const baseUrl = this.configService.get<string>('APP_BASEURL');
    const resetUrl = `${baseUrl}/auth/reset-password?email=${user.email}&token=${prt.token}`;
    try {
      this.amqpConnection.publish('notifications.emails.queues', '', {
        email: {
          to: user.email,
          html: `Hai ${user.fullName}. <a href='${resetUrl}'>Klik di sini</a> untuk reset password.`,
          subject: 'Permintaan Reset Password',
          text: `Hai ${user.fullName}. Gunakan link berikut untuk reset password: ${resetUrl}`,
        } as SendMailDto,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
