import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedRabbitMQModule } from 'src/shared-rabbitmq/shared-rabbitmq.module';
import { User } from 'src/users/entities/user.entity';
import { ChapterReadersController } from './chapter-readers.controller';
import { ChapterReadersService } from './chapter-readers.service';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { ChapterMeta } from './entities/chapter-meta.entity';
import { ChapterReader } from './entities/chapter-reader.entity';
import { Chapter } from './entities/chapter.entity';
import { StoryCategory } from './entities/story-category.entity';
import { StoryComment } from './entities/story-comment.entity';
import { StoryMeta } from './entities/story-meta.entity';
import { StoryReader } from './entities/story-reader.entity';
import { StoryWriter } from './entities/story-writer';
import { Story } from './entities/story.entity';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { StoryCategoriesController } from './story-categories.controller';
import { StoryCategoriesService } from './story-categories.service';
import { StoryCollaborationsGateway } from './story-collaborations.gateway';
import { StoryCommentsController } from './story-comments.controller';
import { StoryCommentsService } from './story-comments.service';
import { StoryReadersController } from './story-readers.controller';
import { StoryReadersService } from './story-readers.service';
import { StoryWritersController } from './story-writers.controller';
import { StoryWritersService } from './story-writers.service';

@Module({
  imports: [
    SharedRabbitMQModule,
    TypeOrmModule.forFeature([
      Chapter,
      ChapterMeta,
      ChapterReader,
      Story,
      StoryWriter,
      StoryReader,
      StoryMeta,
      StoryCategory,
      StoryComment,
      User,
    ]),
  ],
  controllers: [
    StoryCommentsController,
    StoryWritersController,
    StoryReadersController,
    StoryCategoriesController,
    ChapterReadersController,
    ChaptersController,
    StoriesController,
  ],
  providers: [
    StoryCommentsService,
    StoryWritersService,
    StoryReadersService,
    StoriesService,
    StoryCategoriesService,
    ChaptersService,
    ChapterReadersService,
    StoryCollaborationsGateway,
  ],
})
export class StoriesModule {}
