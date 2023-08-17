import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super({
      accessType: 'offline',
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL:
        configService.get<string>('APP_BASEURL') + '/auth/facebook/redirect',
      scope: ['email', 'public_profile'],
    });
  }

  // async validate(token: string, refreshToken: string, profile: Profile) {
  //   console.log(token, refreshToken, profile);
  //   const [user, isNewUser] =
  //     await this.authService.validateUserWithFacebookViaPassport(
  //       token,
  //       refreshToken,
  //       profile,
  //     );
  //   if (isNewUser) {
  //     this.amqpConnection.publish('users.created', '', {
  //       user,
  //     });
  //   }
  //   return user;
  // }
}
