import { Module } from '@nestjs/common';
import { StorytellingsService } from './storytellings.service';
import { StorytellingsController } from './storytellings.controller';

@Module({
  controllers: [StorytellingsController],
  providers: [StorytellingsService]
})
export class StorytellingsModule {}
