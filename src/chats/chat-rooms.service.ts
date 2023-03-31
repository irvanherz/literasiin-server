import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { ChatMember } from './entities/chat-member.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ChatRoom)
    private readonly roomsRepo: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly messagesRepo: Repository<ChatMessage>,
  ) {}

  async create(type: 'personal' | 'group', userIds: number[]) {
    if (userIds.length < 2) return null;
    if (type === 'personal' && userIds.length !== 2) return null;
    if (type === 'personal') {
      const existing = await this.roomsRepo
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.members', 'member')
        .where(
          '(SELECT COUNT(*) FROM chat_member cm WHERE cm."roomId"=room.id AND cm."userId" IN(:a,:b))=2',
          { a: userIds[0], b: userIds[1] },
        )
        .getOne();
      if (existing) return existing;
    }
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

  async findNext(filter: any) {
    const data = await this.roomsRepo.find({
      where: {
        updatedAt: filter?.afterUpdatedAt
          ? MoreThan(filter.afterUpdatedAt)
          : undefined,
        lastMessageId: Not(IsNull()),
        members: { id: filter.userId },
      },
      take: filter?.limit || 5,
      order: { updatedAt: 'DESC' },
    });
    const count = await this.roomsRepo.count({
      where: {
        lastMessageId: Not(IsNull()),
      },
    });
    return [data, count] as [ChatRoom[], number];
  }

  async findById(id: number) {
    const result = await this.roomsRepo.findOne({ where: { id } });
    return result;
  }

  async save(room: ChatRoom) {
    const result = await this.roomsRepo.save(room);
    return result;
  }
}
