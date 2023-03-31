import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Injectable()
export class StoryNotificationsSubscriber {
  constructor(
    private readonly notifService: NotificationsService,
    private readonly notifGateway: NotificationsGateway,
  ) {}

  @WebSocketServer()
  server: Server;

  @RabbitSubscribe({
    exchange: 'stories.writers.invitations.created',
    routingKey: '',
  })
  public async handleStoryWriterInvitationCreated(payload: any) {
    try {
      const { invitation } = payload;
      // notify invitee
      const { userId, storyId } = invitation;
      let notification = await this.notifService.create({
        type: 'stories.writers.invitations.created',
        subtype: 'notify-invitee',
        userId,
        meta: {
          story: { type: 'story', id: storyId },
        },
      });
      notification = await this.notifService.extendNotification(notification);
      this.notifGateway.server
        .to(`users[${userId}]`)
        .emit('notifications.created', { data: notification });
    } catch (err) {
      console.log(err);
    }
  }
}
