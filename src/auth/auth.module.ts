import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Identity } from 'src/users/entities/identity.entity';
import { PasswordResetToken } from 'src/users/entities/password-reset-token.entity';
import { UserDevice } from 'src/users/entities/user-device.entity';
import { UserFollow } from 'src/users/entities/user-follow.entity';
import { User } from 'src/users/entities/user.entity';
import { IdentitiesService } from 'src/users/identities.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: '1234',
      signOptions: { expiresIn: '1h' },
    }),
    BullModule.registerQueue({
      name: 'mails',
    }),
    UsersModule,
    NotificationsModule,
    TypeOrmModule.forFeature([
      User,
      Identity,
      UserFollow,
      PasswordResetToken,
      UserDevice,
      Wallet,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    JwtStrategy,
    UsersService,
    IdentitiesService,
  ],
})
export class AuthModule {}
