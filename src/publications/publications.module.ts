import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from 'src/finances/entities/order-item.entity';
import { Order } from 'src/finances/entities/order.entity';
import { FinancesModule } from 'src/finances/finances.module';
import { OrdersService } from 'src/finances/orders.service';
import { Media } from 'src/media/entities/media.entity';
import { MediaModule } from 'src/media/media.module';
import { MediaService } from 'src/media/media.service';
import { BiteshipService } from 'src/shipments/biteship.service';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { PublicationFile } from './entities/publication-file';
import { PublicationStatus } from './entities/publication-status.entity';
import { Publication } from './entities/publication.entity';
import { PublicationFilesController } from './publication-files.controller';
import { PublicationFilesService } from './publication-files.service';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [
    HttpModule,
    FinancesModule,
    ShipmentsModule,
    MediaModule,
    TypeOrmModule.forFeature([
      Publication,
      PublicationStatus,
      PublicationFile,
      Media,
      Order,
      OrderItem,
    ]),
  ],
  controllers: [PublicationFilesController, PublicationsController],
  providers: [
    PublicationsService,
    MediaService,
    PublicationFilesService,
    OrdersService,
    BiteshipService,
  ],
})
export class PublicationsModule {}
