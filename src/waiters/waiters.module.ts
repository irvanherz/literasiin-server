import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waiter } from './entities/waiter.entity';
import { WaitersController } from './waiters.controller';
import { WaitersService } from './waiters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Waiter])],
  controllers: [WaitersController],
  providers: [WaitersService],
})
export class WaitersModule {}
