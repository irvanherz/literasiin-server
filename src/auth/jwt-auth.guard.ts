import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      console.log(err);

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
