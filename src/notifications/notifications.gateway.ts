import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketJwtAuthGuard } from 'src/auth/socket-jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@WebSocketGateway(7777, { cors: '*' })
export class NotificationsGateway {
  constructor(private readonly notifService: NotificationsService) {}

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('notifications.findNext')
  async handleSendChatMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { filter } = payload;

    const [data, numItems] = await this.notifService.findNextList(filter);
    const lastId = data.at(-1)?.id;
    const meta = { lastId, numItems };
    return { status: 'success', data, meta };
  }
}
