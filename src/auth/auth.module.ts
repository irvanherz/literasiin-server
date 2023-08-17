import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SharedJwtModule } from 'src/shared-jwt/shared-jwt.module';
import { SharedRabbitMQModule } from 'src/shared-rabbitmq/shared-rabbitmq.module';
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
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { SocketJwtAuthGuard } from './socket-jwt-auth.guard';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    SharedJwtModule,
    SharedRabbitMQModule,
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
    FacebookStrategy,
    JwtStrategy,
    UsersService,
    IdentitiesService,
    SocketJwtAuthGuard,
  ],
  exports: [SharedJwtModule, SocketJwtAuthGuard],
})
export class AuthModule {}
