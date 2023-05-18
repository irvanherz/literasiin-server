import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/media/entities/media.entity';
import { MediaModule } from 'src/media/media.module';
import { SharedRabbitMQModule } from 'src/shared-rabbitmq/shared-rabbitmq.module';
import { Identity } from './entities/identity.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { UserAddress } from './entities/user-address';
import { UserDevice } from './entities/user-device.entity';
import { UserFollow } from './entities/user-follow.entity';
import { User } from './entities/user.entity';
import { IdentitiesController } from './identities.controller';
import { IdentitiesService } from './identities.service';
import { UsersAddressesController } from './user-addresses.controller';
import { UserAddressesService } from './user-addresses.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserFollow,
      UserAddress,
      User,
      Identity,
      PasswordResetToken,
      UserDevice,
      Media,
    ]),
    SharedRabbitMQModule,
    MediaModule,
  ],
  controllers: [
    UsersAddressesController,
    IdentitiesController,
    UsersController,
  ],
  providers: [UsersService, IdentitiesService, UserAddressesService],
})
export class UsersModule {}
