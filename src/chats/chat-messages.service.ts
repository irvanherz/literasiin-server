import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
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

  async sendMessage(payload: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roomId = payload.roomId;
      const messagePayload = queryRunner.manager.create(ChatMessage, payload);
      const createdMessage = await queryRunner.manager.save(messagePayload);
      await queryRunner.manager.update(
        ChatRoom,
        { id: roomId },
        { lastMessageId: createdMessage.id },
      );
      const room = await queryRunner.manager.findOne(ChatRoom, {
        where: { id: roomId },
      });
      const message = await queryRunner.manager.findOne(ChatMessage, {
        where: { id: createdMessage.id },
      });
      await queryRunner.commitTransaction();
      return { room, message };
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    const result = await this.messagesRepo.save(payload);
    return result;
  }

  async findNext(filter: any) {
    const data = await this.messagesRepo.find({
      where: {
        roomId: filter?.roomId ? filter.roomId : undefined,
        createdAt: filter?.after
          ? LessThan(moment(filter.after).toDate())
          : undefined,
      },
      take: filter?.limit || 5,
      order: { createdAt: 'desc' },
    });
    const count = await this.messagesRepo.count({
      where: {
        roomId: filter?.roomId ? filter.roomId : undefined,
      },
    });
    return [data, count] as [ChatMessage[], number];
  }

  async findById(id: number) {
    const result = await this.messagesRepo.findOne({ where: { id } });
    return result;
  }
}
