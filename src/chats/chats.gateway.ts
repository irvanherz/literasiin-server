import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketJwtAuthGuard } from 'src/auth/socket-jwt-auth.guard';
import { ChatMessagesService } from './chat-messages.service';
import { ChatRoomsService } from './chat-rooms.service';

@WebSocketGateway(7777, { cors: '*' })
export class ChatsGateway {
  constructor(
    private readonly messagesService: ChatMessagesService,
    private readonly roomsService: ChatRoomsService,
  ) {}

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.messages.create')
  async handleSendChatMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const currentUser = client.data.user;
    const room = await this.roomsService.findById(payload.roomId);

    payload.userId = currentUser.id;
    const created = await this.messagesService.create(payload);
    const data = await this.messagesService.findById(created.id);
    const target = room.members.map((member) => `users[${member.id}]`);

    client.to(target).emit('chats.messages.created', { data });
    return { data };
  }

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.rooms.findMany')
  async findManyRooms(@MessageBody() filter: any) {
    const [data, numItems] = await this.roomsService.findMany(filter);
    const meta = { numItems };
    return { status: 'success', data, meta };
  }

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.messages.findMany')
  async findManyMessages(@MessageBody() filter: any) {
    const [data, numItems] = await this.messagesService.findMany(filter);
    const lastId = data.at(-1)?.id;
    const meta = { numItems, lastId };
    return { data, meta };
  }

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.rooms.findById')
  async findRoomById(@MessageBody() filter: any) {
    const data = await this.roomsService.findById(filter.id);
    const meta = {};
    return { status: 'success', data, meta };
  }
}
