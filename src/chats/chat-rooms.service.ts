import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
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

  async findMany(filter: any) {
    const result = await this.roomsRepo.findAndCount({
      where: {
        id: filter?.afterId ? MoreThan(filter.afterId) : undefined,
      },
      take: filter?.limit || 5,
      order: { updatedAt: 'DESC' },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.roomsRepo.findOne({ where: { id } });
    return result;
  }
}
