import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ChatRoomsService } from './chat-rooms.service';

@Controller()
export class ChatsController {
  constructor(private readonly roomsService: ChatRoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('chats/with/:userId')
  async createPersonalChat(
    @Param('userId') userId: number,
    @User() currentUser,
  ) {
    const room = await this.roomsService.create('personal', [
      currentUser?.id,
      userId,
    ]);
    return { data: room };
  }
}
