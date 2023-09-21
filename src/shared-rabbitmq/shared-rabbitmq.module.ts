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
          //USERS
          {
            name: 'users.created',
            type: 'fanout',
            options: { autoDelete: true },
          },
          {
            name: 'users.followed',
            type: 'fanout',
            options: { autoDelete: true },
          },
          {
            name: 'users.passwordResetTokens.created',
            type: 'fanout',
            options: { autoDelete: true },
          },
          //STORIES
          {
            name: 'stories.writers.invitations.created',
            type: 'fanout',
            options: { autoDelete: true },
          },
          //FINANCE
          {
            name: 'finances.payments.created',
            type: 'fanout',
            options: { autoDelete: true },
          },
          {
            name: 'finances.payments.updated',
            type: 'fanout',
            options: { autoDelete: true },
          },
          {
            name: 'finances.orders.items.paid',
            type: 'fanout',
            options: { autoDelete: true },
          },
          {
            name: 'finances.orders.items.failed',
            type: 'fanout',
            options: { autoDelete: true },
          },
          {
            name: 'finances.orders.items.canceled',
            type: 'fanout',
            options: { autoDelete: true },
          },
          //NOTIF
          {
            name: 'notifications.emails.queues',
            type: 'direct',
            options: { autoDelete: true },
          },
        ],
      }),
    }),
  ],
  providers: [],
  exports: [RabbitMQModule],
})
export class SharedRabbitMQModule {}
