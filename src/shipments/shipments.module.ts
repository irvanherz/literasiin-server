import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiteshipController } from './biteship.controller';
import { BiteshipService } from './biteship.service';
import { Shipment } from './entities/shipment.entity';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([Shipment])],
  controllers: [ShipmentsController, BiteshipController],
  providers: [ShipmentsService, BiteshipService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
