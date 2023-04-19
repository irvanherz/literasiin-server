import { Body, Controller, Post } from '@nestjs/common';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import { WaitersService } from './waiters.service';

@Controller('waiters')
export class WaitersController {
  constructor(private readonly waitersService: WaitersService) {}

  @Post()
  async create(@Body() payload: CreateWaiterDto) {
    const existing = await this.waitersService.findByEmail(payload.email);
    if (existing) throw 'Email tersebut sudah masuk ke dalam waiting list';
    await this.waitersService.save(payload);
  }
}
