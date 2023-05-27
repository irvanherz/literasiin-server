import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BiteshipService } from './biteship.service';
import { ShipmentsService } from './shipments.service';

@Controller('shipments')
export class BiteshipController {
  constructor(
    private readonly shipmentsService: ShipmentsService,
    private readonly biteshipService: BiteshipService,
  ) {}

  @HttpCode(200)
  @Post('/biteship/webhooks/status')
  async statusWebhook(@Body() body: any) {
    console.log(body);

    return 'OK';
  }
}
