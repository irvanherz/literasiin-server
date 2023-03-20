import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway(7777, { cors: '*' })
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}
  @SubscribeMessage('chats.messages.create')
  async handleSendChatMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const result = { data: { id: 1, roomId: 1 } };
    client.emit('chats.messages.created', result);
  }

  @SubscribeMessage('chats.rooms.findMany')
  async findManyRooms(
    @MessageBody() filter: any,
    @ConnectedSocket() client: Socket,
  ) {
    const [data, numItems] = await this.chatsService.findManyRooms(filter);
    const meta = { numItems };
    return { data, meta };
  }

  @SubscribeMessage('chats.messages.findMany')
  async findManyMessages(
    @MessageBody() filter: any,
    @ConnectedSocket() client: Socket,
  ) {
    const [data, numItems] = await this.chatsService.findManyMessages(filter);
    const meta = { numItems };
    return { data, meta };
  }
}
