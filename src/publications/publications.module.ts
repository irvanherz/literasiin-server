import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationFile } from './entities/publication-file';
import { PublicationStatus } from './entities/publication-status.entity';
import { Publication } from './entities/publication.entity';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, PublicationStatus, PublicationFile]),
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
