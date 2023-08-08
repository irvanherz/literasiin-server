/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExtendedFilter } from 'src/libs/validations';

export class StorytellingEpisodeFilter {
  @IsOptional()
  @IsNumber()
  storytellingId: number;
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

export class FindStorytellingEpisodeByIdOptions {
  @IsOptional()
  @Transform(({ obj }) => {
    return [true, 'enabled', 'true'].indexOf(obj.includeStorytelling) > -1;
  })
  @IsBoolean()
  includeStorytelling?: boolean;
}

export class CreateStorytellingEpisodeDto {
  @IsNumber()
  storytellingId: number;
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
}

export class UpdateStorytellingEpisodeDto extends PartialType(
  CreateStorytellingEpisodeDto,
) {}
