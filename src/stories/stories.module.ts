import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapter.entity';
import { StoryCategory } from './entities/story-category.entity';
import { StoryTag } from './entities/story-tag.entity';
import { Story } from './entities/story.entity';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { StoryCategoriesController } from './story-categories.controller';
import { StoryCategoriesService } from './story-categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story, Chapter, StoryCategory, StoryTag, User]),
  ],
  controllers: [
    StoryCategoriesController,
    ChaptersController,
    StoriesController,
  ],
  providers: [StoriesService, StoryCategoriesService, ChaptersService],
})
export class StoriesModule {}
