import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/media/entities/media.entity';
import { MediaModule } from 'src/media/media.module';
import { SharedRabbitMQModule } from 'src/shared-rabbitmq/shared-rabbitmq.module';
import { Identity } from './entities/identity.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { UserDevice } from './entities/user-device.entity';
import { UserFollow } from './entities/user-follow.entity';
import { User } from './entities/user.entity';
import { IdentitiesController } from './identities.controller';
import { IdentitiesService } from './identities.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserFollow,
      User,
      Identity,
      PasswordResetToken,
      UserDevice,
      Media,
    ]),
    SharedRabbitMQModule,
    MediaModule,
  ],
  controllers: [IdentitiesController, UsersController],
  providers: [UsersService, IdentitiesService],
})
export class UsersModule {}
