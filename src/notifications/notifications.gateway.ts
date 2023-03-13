import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ transports: ['websocket'] })
export class NotificationsGateway {
  @SubscribeMessage('notifications')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
