import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(5001, { transports: ['websocket'] })
export class ChatsGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
