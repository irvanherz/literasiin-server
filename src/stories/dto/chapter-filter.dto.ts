/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExtendedFilter } from 'src/libs/validations';

export class ChapterFilterDto {
  @IsOptional()
  @IsNumber()
  storyId: number;
  @IsOptional()
  @IsString()
  status?: ExtendedFilter<'draft' | 'published'> = 'published';
  @IsOptional()
  @IsNumber()
  page: number = 1;
  @IsOptional()
  @IsNumber()
  limit: number = 100;
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder: string = 'asc';
}

export class FindChapterByIdOptions {
  @IsOptional()
  @Transform(({ obj }) => {
    return [true, 'enabled', 'true'].indexOf(obj.includeStory) > -1;
  })
  @IsBoolean()
  includeStory?: boolean;
}
