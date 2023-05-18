import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BiteshipService } from './biteship.service';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsService, BiteshipService],
})
export class ShipmentsModule {}
