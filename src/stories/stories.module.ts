import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { ChapterMeta } from './entities/chapter-meta.entity';
import { ChapterVote } from './entities/chapter-vote.entity';
import { Chapter } from './entities/chapter.entity';
import { StoryCategory } from './entities/story-category.entity';
import { StoryMeta } from './entities/story-meta.entity';
import { StoryTagMap } from './entities/story-tag-map.entity';
import { StoryTag } from './entities/story-tag.entity';
import { Story } from './entities/story.entity';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { StoryCategoriesController } from './story-categories.controller';
import { StoryCategoriesService } from './story-categories.service';
import { StoryTagsController } from './story-tags.controller';
import { StoryTagsService } from './story-tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chapter,
      ChapterMeta,
      ChapterVote,
      Story,
      StoryMeta,
      StoryCategory,
      StoryTag,
      StoryTagMap,
      User,
    ]),
  ],
  controllers: [
    StoryTagsController,
    StoryCategoriesController,
    ChaptersController,
    StoriesController,
  ],
  providers: [
    StoriesService,
    StoryTagsService,
    StoryCategoriesService,
    ChaptersService,
  ],
})
export class StoriesModule {}
