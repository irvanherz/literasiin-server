import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationStatus } from './entities/publication-status.entity';
import { Publication } from './entities/publication.entity';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, PublicationStatus])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
