import { Body, Controller, Post } from '@nestjs/common';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import { WaitersService } from './waiters.service';

@Controller('waiters')
export class WaitersController {
  constructor(private readonly waitersService: WaitersService) {}

  @Post()
  async create(@Body() payload: CreateWaiterDto) {
    await this.waitersService.save(payload);
  }
}
