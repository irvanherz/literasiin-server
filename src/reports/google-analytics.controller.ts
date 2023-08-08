import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { Controller, Get } from '@nestjs/common';
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
  @Get('current-active-users-per-country')
  async getCurrentActiveUsers() {
    const [response] = await this.adc.runRealtimeReport({
      property: `properties/${this.configsService.get<string>(
        'GOOGLE_ANALYTICS_PROPERTY_ID',
      )}`,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
    });

    return {
      data: response,
    };
  }
}
