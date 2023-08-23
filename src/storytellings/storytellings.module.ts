import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedRabbitMQModule } from 'src/shared-rabbitmq/shared-rabbitmq.module';
import { User } from 'src/users/entities/user.entity';
import { StorytellingAudience } from './entities/storytelling-audience.entity';
import { StorytellingAuthor } from './entities/storytelling-author.entity';
import { StorytellingCategory } from './entities/storytelling-category.entity';
import { StorytellingEpisodeAudience } from './entities/storytelling-episode-audience.entity';
import { StorytellingEpisodeMeta } from './entities/storytelling-episode-meta.entity';
import { StorytellingEpisode } from './entities/storytelling-episode.entity';
import { StorytellingMeta } from './entities/storytelling-meta.entity';
import { Storytelling } from './entities/storytelling.entity';
import { StorytellingAudiencesController } from './storytelling-audiences.controller';
import { StorytellingAudiencesService } from './storytelling-audiences.service';
import { StorytellingAuthorsController } from './storytelling-authors.controller';
import { StorytellingAuthorsService } from './storytelling-authors.service';
import { StorytellingCategoriesController } from './storytelling-categories.controller';
import { StorytellingCategoriesService } from './storytelling-categories.service';
import { StorytellingEpisodeAudiencesController } from './storytelling-episode-audience.controller';
import { StorytellingEpisodeAudiencesService } from './storytelling-episode-audience.service';
import { StorytellingEpisodesController } from './storytelling-episodes.controller';
import { StorytellingEpisodesService } from './storytelling-episodes.service';
import { StorytellingsController } from './storytellings.controller';
import { StorytellingsService } from './storytellings.service';

@Module({
  imports: [
    SharedRabbitMQModule,
    TypeOrmModule.forFeature([
      Storytelling,
      StorytellingAuthor,
      StorytellingAudience,
      StorytellingCategory,
      StorytellingMeta,
      StorytellingEpisode,
      StorytellingEpisodeMeta,
      StorytellingEpisodeAudience,
      User,
    ]),
  ],
  controllers: [
    StorytellingEpisodeAudiencesController,
    StorytellingAudiencesController,
    StorytellingAuthorsController,
    StorytellingCategoriesController,
    StorytellingEpisodesController,
    StorytellingsController,
  ],
  providers: [
    StorytellingEpisodeAudiencesService,
    StorytellingAudiencesService,
    StorytellingAuthorsService,
    StorytellingCategoriesService,
    StorytellingEpisodesService,
    StorytellingsService,
  ],
})
export class StorytellingsModule {}
