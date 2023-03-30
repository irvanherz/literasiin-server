import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LessThan, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}
  async create(payload: Partial<Notification>) {
    const result = await this.notifRepo.save(payload);
    this.server.emit('notifications.created', { data: result });
    return result;
  }

  async findMany(filter: any) {
    const result = await this.notifRepo.findAndCount({
      where: {
        id: filter?.afterId ? LessThan(filter.afterId) : undefined,
      },
      take: filter?.limit || 5,
      order: { id: 'DESC' },
    });
    return result;
  }

  async findNextList(filter: any) {
    const data = await this.notifRepo.find({
      where: {
        id: filter?.lastId ? LessThan(filter.lastId) : undefined,
      },
      take: filter?.limit || 5,
      order: { id: 'DESC' },
    });
    const count = await this.notifRepo.count();
    return [data, count] as [Notification[], number];
  }
}
