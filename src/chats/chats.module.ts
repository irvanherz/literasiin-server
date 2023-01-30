import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway]
})
export class ChatsModule {}
