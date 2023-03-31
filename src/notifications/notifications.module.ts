import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketJwtAuthGuard } from 'src/auth/socket-jwt-auth.guard';
import { SharedJwtModule } from 'src/shared-jwt/shared-jwt.module';
import { Story } from 'src/stories/entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import { EmailTemplatesController } from './email-templates.controller';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplate } from './entities/email-template.entity';
import { Notification } from './entities/notification.entity';
import { MailsProcessor } from './mails.processor';
import { MailsService } from './mails.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { StoryNotificationsSubscriber } from './story-notifications.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplate, Notification, User, Story]),
    BullModule.registerQueue({ name: 'mails' }, { name: 'invoices' }),
    SharedJwtModule,
  ],
  controllers: [EmailTemplatesController, NotificationsController],
  providers: [
    NotificationsService,
    NotificationsGateway,
    MailsService,
    EmailTemplatesService,
    MailsProcessor,
    StoryNotificationsSubscriber,
    SocketJwtAuthGuard,
  ],
  exports: [MailsService, NotificationsService],
})
export class NotificationsModule {}
