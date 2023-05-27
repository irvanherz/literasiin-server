import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationsModule } from 'src/configurations/configurations.module';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { Configuration } from 'src/configurations/entities/configuration.entity';
import { OrderItem } from 'src/finances/entities/order-item.entity';
import { Order } from 'src/finances/entities/order.entity';
import { FinancesModule } from 'src/finances/finances.module';
import { OrdersService } from 'src/finances/orders.service';
import { Media } from 'src/media/entities/media.entity';
import { MediaModule } from 'src/media/media.module';
import { MediaService } from 'src/media/media.service';
import { BiteshipService } from 'src/shipments/biteship.service';
import { Shipment } from 'src/shipments/entities/shipment.entity';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { PublicationFile } from './entities/publication-file';
import { PublicationStatus } from './entities/publication-status.entity';
import { Publication } from './entities/publication.entity';
import { FinancesSubscriber } from './finances.subscriber';
import { PublicationFilesController } from './publication-files.controller';
import { PublicationFilesService } from './publication-files.service';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [
    HttpModule,
    FinancesModule,
    ShipmentsModule,
    ConfigurationsModule,
    MediaModule,
    TypeOrmModule.forFeature([
      Publication,
      PublicationStatus,
      PublicationFile,
      Media,
      Order,
      OrderItem,
      Shipment,
      Configuration,
    ]),
  ],
  controllers: [PublicationFilesController, PublicationsController],
  providers: [
    PublicationsService,
    MediaService,
    PublicationFilesService,
    OrdersService,
    BiteshipService,
    FinancesSubscriber,
    ShipmentsService,
    ConfigurationsService,
  ],
})
export class PublicationsModule {}
