import { Controller, Get } from '@nestjs/common';
import { BiteshipService } from './biteship.service';
import { ShipmentsService } from './shipments.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(
    private readonly shipmentsService: ShipmentsService,
    private readonly biteshipService: BiteshipService,
  ) {}

  @Get()
  async findAll() {
    const data = await this.biteshipService.queryCouriers();
    return { data };
  }
  @Get('/x')
  async findAllX() {
    const data = await this.biteshipService.queryCourierRates({
      origin_postal_code: 57139,
      destination_postal_code: 66111,
      couriers: 'jne',
      items: [
        {
          name: 'Selft Publishing',
          quantity: 1,
          value: 50000,
          weight: 1000,
        },
      ],
    });
    return { data };
  }
}
