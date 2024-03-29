import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super({
      accessType: 'offline',
      clientID: configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL:
        configService.get<string>('APP_BASEURL') + '/auth/google/redirect',
      scope: ['email', 'profile', 'openid'],
    });
  }

  // async validate(token: string, refreshToken: string, profile: Profile) {
  //   console.log(token, refreshToken, profile);
  //   const [user, isNewUser] =
  //     await this.authService.validateUserWithGoogleViaPassport(
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
