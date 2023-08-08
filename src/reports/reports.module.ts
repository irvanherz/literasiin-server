import { Module } from '@nestjs/common';
import { GoogleAnalyticsController } from './google-analytics.controller';

@Module({
  controllers: [GoogleAnalyticsController],
  providers: [],
})
export class ReportsModule {}
