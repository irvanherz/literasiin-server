import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ejs from 'ejs';
import { Repository } from 'typeorm';
import { SendMailDto } from './dto/send-mail.dto';
import { EmailTemplate } from './entities/email-template.entity';

@Injectable()
export class MailsService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly templateRepo: Repository<EmailTemplate>,
    private readonly mailerService: MailerService,
  ) {}

  async send(payload: SendMailDto) {
    try {
      const sendMailData = {
        to: payload.to,
        subject: payload?.subject || '<no subject>',
        text: payload?.text,
        html: payload?.html,
      };
      if (payload.template?.name) {
        const template = await this.templateRepo.findOneBy({
          name: payload.template.name,
        });
        sendMailData.subject = await ejs.render(
          template.subject,
          payload.template.parameters,
          { async: true },
        );
        sendMailData.html = await ejs.render(
          template.html,
          payload.template.parameters,
          { async: true },
        );
        sendMailData.text = await ejs.render(
          template.text,
          payload.template.parameters,
          { async: true },
        );
      }
      await this.mailerService.sendMail(sendMailData);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
