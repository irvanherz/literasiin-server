/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const auth = context.switchToHttp().getRequest().get('authorization') || '';
    if ((err || !user) && auth.startsWith('Bearer')) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Token already expired',
          'auth/token-expired',
        );
      } else if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token', 'auth/invalid-token');
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
