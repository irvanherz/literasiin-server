import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMessage } from './entities/user-message.entity';
import { UserMessagesController } from './user-messages.controller';
import { UserMessagesService } from './user-messages.service';

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([UserMessage])],
  controllers: [UserMessagesController],
  providers: [UserMessagesService],
})
export class GeneralModule {}
