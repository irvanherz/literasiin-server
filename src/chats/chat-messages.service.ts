import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ChatRoom)
    private readonly roomsRepo: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly messagesRepo: Repository<ChatMessage>,
  ) {}

  async create(payload: any) {
    const result = await this.messagesRepo.save(payload);
    return result;
  }

  async findMany(filter: any) {
    console.log(filter);

    const result = await this.messagesRepo.findAndCount({
      where: {
        roomId: filter?.roomId ? filter.roomId : undefined,
        id: filter?.afterId ? LessThan(filter.afterId) : undefined,
      },
      take: filter?.limit || 5,
      order: { createdAt: 'desc' },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.messagesRepo.findOne({ where: { id } });
    return result;
  }
}
