import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from './entities/identity.entity';
import { User } from './entities/user.entity';
import { IdentitiesService } from './identities.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Identity])],
  controllers: [UsersController],
  providers: [UsersService, IdentitiesService],
})
export class UsersModule {}
