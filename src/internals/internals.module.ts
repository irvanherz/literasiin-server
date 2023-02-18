import { Module } from '@nestjs/common';
import { InternalsService } from './internals.service';
import { InternalsController } from './internals.controller';

@Module({
  controllers: [InternalsController],
  providers: [InternalsService]
})
export class InternalsModule {}
