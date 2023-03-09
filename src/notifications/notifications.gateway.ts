import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(5001)
export class NotificationsGateway {
  @SubscribeMessage('notifications')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
