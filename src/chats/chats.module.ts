import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/entities/user.entity';
import { ChatMessagesService } from './chat-messages.service';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatMember } from './entities/chat-member.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatMember, ChatMessage, User]),
    AuthModule,
  ],
  controllers: [ChatsController],
  providers: [
    ChatsService,
    ChatRoomsService,
    ChatMessagesService,
    ChatsGateway,
  ],
})
export class ChatsModule {}
