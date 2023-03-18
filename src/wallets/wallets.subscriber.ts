import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Injectable()
export class WalletsSubscriber {
  constructor(private readonly walletsService: WalletsService) {}

  @RabbitSubscribe({
    exchange: 'users.created',
    routingKey: '',
  })
  public async handleUserCreated(msg: any) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}
