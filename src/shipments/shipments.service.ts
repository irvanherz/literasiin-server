import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentsRepo: Repository<Shipment>,
  ) {}
  async create(payload: Partial<Shipment>) {
    const result = await this.shipmentsRepo.save(payload);
    return result;
  }

  async save(payload: Partial<Shipment>) {
    const result = await this.shipmentsRepo.save(payload);
    return result;
  }
}
