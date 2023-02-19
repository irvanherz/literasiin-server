/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    // console.log('errorGuard', err, user, info, status);
    if (err || !user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
