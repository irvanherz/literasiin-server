import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketJwtAuthGuard } from 'src/auth/socket-jwt-auth.guard';
import { SharedJwtModule } from 'src/shared-jwt/shared-jwt.module';
import { SharedRabbitMQModule } from 'src/shared-rabbitmq/shared-rabbitmq.module';
import { Story } from 'src/stories/entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import { EmailNotificationQueuesSubscriber } from './email-notification-queues.subscriber';
import { EmailTemplatesController } from './email-templates.controller';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplate } from './entities/email-template.entity';
import { Notification } from './entities/notification.entity';
import { MailsService } from './mails.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { StoryNotificationsSubscriber } from './story-notifications.subscriber';
import { UserEmailNotificationsSubscriber } from './user-email-notifications.subscriber';

@Module({
  imports: [
    SharedRabbitMQModule,
    TypeOrmModule.forFeature([EmailTemplate, Notification, User, Story]),
    SharedJwtModule,
  ],
  controllers: [EmailTemplatesController, NotificationsController],
  providers: [
    NotificationsService,
    NotificationsGateway,
    MailsService,
    EmailTemplatesService,
    StoryNotificationsSubscriber,
    SocketJwtAuthGuard,
    UserEmailNotificationsSubscriber,
    EmailNotificationQueuesSubscriber,
  ],
  exports: [MailsService, NotificationsService],
})
export class NotificationsModule {}
