import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class SocketJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean | any> {
    const client = context.switchToWs().getClient<Socket>();
    const authorization = client.handshake.headers.authorization || '';
    const token = authorization.split(' ')?.[1];
    try {
      const user = this.jwtService.verify(token);
      const client = context.switchToWs().getClient<Socket>();
      client.data.user = user;
      client.join(`users[${user.id}]`);

      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
