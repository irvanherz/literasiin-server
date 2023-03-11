import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplatesController } from './email-templates.controller';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplate } from './entities/email-template.entity';
import { MailsProcessor } from './mails.processor';
import { MailsService } from './mails.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplate]),
    BullModule.registerQueue({ name: 'mails' }, { name: 'invoices' }),
  ],
  controllers: [EmailTemplatesController, NotificationsController],
  providers: [
    NotificationsService,
    NotificationsGateway,
    MailsService,
    EmailTemplatesService,
    MailsProcessor,
  ],
  exports: [MailsService, NotificationsService],
})
export class NotificationsModule {}
