import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Story } from 'src/stories/entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import { In, LessThan, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(Story)
    private readonly storiesRepo: Repository<Story>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async extendNotifications(notifications: Notification[]) {
    const storyIds = [];
    const userIds = [];
    for (const notif of notifications) {
      const meta = notif.meta;
      for (const val of Object.values<any>(meta)) {
        switch (val?.type) {
          case 'user':
            userIds.push(val?.id);
          case 'story':
            storyIds.push(val?.id);
        }
      }
    }

    const stories = this.storiesRepo.find({ where: { id: In(storyIds) } });
    const users = this.usersRepo.find({ where: { id: In(userIds) } });
    const storyById = _.keyBy(stories, 'id');
    const userById = _.keyBy(users, 'id');

    const result = [];
    for (const notif of notifications) {
      const meta = notif.meta;
      for (const entry of Object.entries<any>(meta)) {
        const [key, val] = entry;
        const { id, type } = val;
        switch (type) {
          case 'user':
            meta[key] = userById[id];
          case 'story':
            meta[key] = storyById[id];
        }
      }
      notif.meta = meta;
      result.push(notif);
    }
    return result;
  }

  async extendNotification(notification: Notification) {
    const extended = await this.extendNotifications([notification]);
    return extended[0];
  }

  async create(payload: Partial<Notification>) {
    const result = await this.notifRepo.save(payload);
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
    result[0] = await this.extendNotifications(result[0]);
    return result;
  }

  async findNextList(filter: any) {
    let data = await this.notifRepo.find({
      where: {
        userId: filter?.userId ? filter.userId : undefined,
        id: filter?.lastId ? LessThan(filter.lastId) : undefined,
      },
      take: filter?.limit || 5,
      order: { id: 'DESC' },
    });
    const count = await this.notifRepo.count({
      where: {
        userId: filter?.userId ? filter.userId : undefined,
      },
    });
    data = await this.extendNotifications(data);
    return [data, count] as [Notification[], number];
  }
}
