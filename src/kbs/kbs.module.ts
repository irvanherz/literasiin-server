import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KbCategory } from './entities/kb-category.entity';
import { Kb } from './entities/kb.entity';
import { KbCategoriesController } from './kb-categories.controller';
import { KbCategoriesService } from './kb-categories.service';
import { KbsController } from './kbs.controller';
import { KbsService } from './kbs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Kb, KbCategory])],
  controllers: [KbsController, KbCategoriesController],
  providers: [KbsService, KbCategoriesService],
})
export class KbsModule {}
