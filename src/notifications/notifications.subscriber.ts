import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsSubscriber {
  constructor(private readonly notificationsService: NotificationsService) {}

  @RabbitSubscribe({
    exchange: 'users.created',
    routingKey: '',
  })
  public async handleUserCreated(msg: any) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }

  @RabbitSubscribe({
    exchange: 'users.followed',
    routingKey: '',
  })
  public async handleUserFollowed(msg: any) {
    // const { follower, following } = msg;
    // await this.notificationsService.create({
    //   type: 'new-follower',
    //   userId: following.id,
    //   meta: { follower },
    // });
  }
}
