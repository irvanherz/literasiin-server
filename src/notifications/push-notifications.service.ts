import { Injectable } from '@nestjs/common';
import { MessageOptions } from 'child_process';
import * as admin from 'firebase-admin';
import {
  Message,
  MessagingPayload,
} from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class PushNotificationsService {
  async sendMulticast(tokens: string[], msg: Message) {
    await admin.messaging().sendMulticast({ ...msg, tokens });
    // TODO: Hapus notificationToken jika error
  }

  async sendToTopic(
    topic: string,
    payload: MessagingPayload,
    options: MessageOptions,
  ) {
    await admin.messaging().sendToTopic(topic, payload, options);
  }
}
