import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
