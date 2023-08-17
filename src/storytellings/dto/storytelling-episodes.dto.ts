/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExtendedFilter } from 'src/libs/validations';

export class StorytellingEpisodeFilter {
  @IsOptional()
  @IsNumber()
  storytellingId?: number;
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
  @IsNumber()
  price?: number;
  @IsOptional()
  @IsNumber()
  mediaId?: number;
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';
}

export class UpdateStorytellingEpisodeDto extends PartialType(
  CreateStorytellingEpisodeDto,
) {}
