import { Module } from '@nestjs/common';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';

@Module({
  controllers: [RobotsController],
  providers: [RobotsService],
})
export class RobotsModule {}
