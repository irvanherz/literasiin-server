import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ChatMember } from './entities/chat-member.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';

@Injectable()
export class ChatsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ChatRoom)
    private readonly roomsRepo: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly messagesRepo: Repository<ChatMessage>,
  ) {}

  async createRoom(type: 'personal' | 'group', userIds: number[]) {
    if (userIds.length < 2) return null;
    if (type === 'personal' && userIds.length !== 2) return null;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roomPayload = queryRunner.manager.create(ChatRoom, {
        type,
      });
      const room = await queryRunner.manager.save(roomPayload);
      const roomId = room.id;
      const membersPayload = userIds.map((userId) =>
        queryRunner.manager.create(ChatMember, { roomId, userId }),
      );
      await queryRunner.manager.save(membersPayload);
      await queryRunner.commitTransaction();
      return room;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return null;
  }

  async createMessage(payload: Partial<ChatMessage>) {
    const result = await this.messagesRepo.save(payload);
    return result;
  }

  async updateMessage(payload: Partial<ChatMessage>) {
    const result = await this.messagesRepo.save(payload);
    return result;
  }

  async updateMessageById(id: number, payload: Partial<ChatMessage>) {
    const result = await this.messagesRepo.save({ ...payload, id });
    return result;
  }

  async findManyRooms(filter: any) {
    const result = await this.roomsRepo.findAndCount();
    return result;
  }

  async findManyMessages(filter: any) {
    const result = await this.messagesRepo.findAndCount();
    return result;
  }
}
