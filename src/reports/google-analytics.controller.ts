import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.

@Controller('reports/google-analytics')
export class GoogleAnalyticsController {
  private adc: BetaAnalyticsDataClient;

  constructor(private readonly configsService: ConfigService) {
    this.adc = new BetaAnalyticsDataClient();
  }

  // @UseGuards(JwtAuthGuard)
  @Post('run-realtime-report')
  async runRealtimeReport(@Body() payload: any) {
    console.log(payload);

    const [response] = await this.adc.runRealtimeReport({
      ...payload,
      property: `properties/${this.configsService.get<string>(
        'GOOGLE_ANALYTICS_PROPERTY_ID',
      )}`,
    });

    return {
      data: response,
    };
  }

  @Post('run-report')
  async runReport(@Body() payload: any) {
    const [response] = await this.adc.runReport({
      ...payload,
      property: `properties/${this.configsService.get<string>(
        'GOOGLE_ANALYTICS_PROPERTY_ID',
      )}`,
    });

    return {
      data: response,
    };
  }
}
