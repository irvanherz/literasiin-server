import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SharedJwtModule } from 'src/shared-jwt/shared-jwt.module';
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
import { SocketJwtAuthGuard } from './socket-jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    SharedJwtModule,
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
    SocketJwtAuthGuard,
  ],
  exports: [SharedJwtModule, SocketJwtAuthGuard],
})
export class AuthModule {}
