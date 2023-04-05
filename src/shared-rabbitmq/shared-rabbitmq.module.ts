import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [],
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_SERVER'),
        exchanges: [
          //USER
          {
            name: 'users.created',
            type: 'fanout',
          },
          {
            name: 'users.followed',
            type: 'fanout',
          },
          {
            name: 'users.passwordResetTokens.created',
            type: 'fanout',
          },
          //STORIES
          {
            name: 'stories.writers.invitations.created',
            type: 'fanout',
          },
          //FINANCE
          {
            name: 'finances.invoices.created',
            type: 'fanout',
          },
          {
            name: 'finances.invoices.paid',
            type: 'fanout',
          },
          {
            name: 'finances.invoices.canceled',
            type: 'fanout',
          },
          //NOTIF
          {
            name: 'notifications.emails.queues',
            type: 'direct',
          },
        ],
      }),
    }),
  ],
  providers: [],
  exports: [RabbitMQModule],
})
export class SharedRabbitMQModule {}
