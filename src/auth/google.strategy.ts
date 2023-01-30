import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID:
        '39971933189-ruupvo6p1e5hccsm0nsnboff03dfpa12.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'https://irvan3000.loca.lt/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(token: string, refreshToken: string, profile: Profile) {
    console.log(token, refreshToken, profile);
    return { id: 1 };
  }
}
