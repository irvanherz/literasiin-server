import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ChapterCommentStatus } from '../entities/chapter.entity';

export class CreateChapterDto {
  @IsNumber()
  storyId: number;
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  @IsString()
  status: 'draft' | 'published';
  @IsOptional()
  @IsNumber()
  price?: number;
  @IsOptional()
  @IsString()
  commentStatus?: ChapterCommentStatus;
}
