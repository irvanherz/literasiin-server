import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketJwtAuthGuard } from 'src/auth/socket-jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@WebSocketGateway(7777, { cors: '*' })
export class NotificationsGateway {
  constructor(private readonly notifService: NotificationsService) {}

  @WebSocketServer()
  public server: Server;

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('notifications.findNext')
  async handleFindNext(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { filter } = payload;
    filter.userId = client.data.user.id;

    const [data, numItems] = await this.notifService.findNextList(filter);
    const lastId = data.at(-1)?.id;
    const meta = { lastId, numItems };
    return { status: 'success', data, meta };
  }
}
