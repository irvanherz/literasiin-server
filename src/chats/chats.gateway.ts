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
import { ChatMessagesService } from './chat-messages.service';
import { ChatRoomsService } from './chat-rooms.service';

@WebSocketGateway(7777, { cors: '*' })
export class ChatsGateway {
  constructor(
    private readonly messagesService: ChatMessagesService,
    private readonly roomsService: ChatRoomsService,
  ) {}

  @WebSocketServer() server: Server;

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.messages.create')
  async handleSendChatMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const currentUser = client.data.user;
    payload.userId = currentUser.id;
    const { room, message } = await this.messagesService.sendMessage(payload);

    const targetIds = room.members.map((member) => `users[${member.id}]`);
    client.to(targetIds).emit('chats.messages.created', { data: message });
    client.to(targetIds).emit('chats.rooms.updated', { data: room });
    return { data: { room, message } };
  }

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.rooms.findNext')
  async findManyRooms(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const filter = payload.filter;
    filter.userId = client.data.user.id;
    const [data, numItems] = await this.roomsService.findNext(filter);
    const lastUpdatedAt = data.at(-1)?.updatedAt;
    const meta = { numItems, lastUpdatedAt };
    return { success: true, data, meta };
  }

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.messages.findNext')
  async findManyMessages(@MessageBody() payload: any) {
    const filter = payload.filter || {};
    const [data, numItems] = await this.messagesService.findNext(filter);
    const after = data.at(-1)?.createdAt;
    const meta = { numItems, after };

    return { success: true, data, meta };
  }

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage('chats.rooms.findById')
  async findRoomById(@MessageBody() payload: any) {
    const data = await this.roomsService.findById(payload.id);
    if (!data) return { success: false };
    const meta = {};
    return { success: true, data, meta };
  }
}
