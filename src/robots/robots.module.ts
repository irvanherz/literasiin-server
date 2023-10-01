import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersService } from 'src/stories/chapters.service';
import { ChapterMeta } from 'src/stories/entities/chapter-meta.entity';
import { ChapterReader } from 'src/stories/entities/chapter-reader.entity';
import { Chapter } from 'src/stories/entities/chapter.entity';
import { StoryCategory } from 'src/stories/entities/story-category.entity';
import { StoryComment } from 'src/stories/entities/story-comment.entity';
import { StoryMeta } from 'src/stories/entities/story-meta.entity';
import { StoryReader } from 'src/stories/entities/story-reader.entity';
import { StoryWriter } from 'src/stories/entities/story-writer';
import { Story } from 'src/stories/entities/story.entity';
import { StoriesModule } from 'src/stories/stories.module';
import { StoriesService } from 'src/stories/stories.service';
import { User } from 'src/users/entities/user.entity';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';

@Module({
  imports: [
    StoriesModule,
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
  controllers: [RobotsController],
  providers: [RobotsService, StoriesService, ChaptersService],
})
export class RobotsModule {}
