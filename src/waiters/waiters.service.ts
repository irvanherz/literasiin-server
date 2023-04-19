import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import { Waiter } from './entities/waiter.entity';

@Injectable()
export class WaitersService {
  constructor(
    @InjectRepository(Waiter)
    private readonly waitersRepo: Repository<Waiter>,
  ) {}
  async save(payload: Partial<CreateWaiterDto>) {
    const result = await this.waitersRepo.save(payload);
    return result;
  }
}
