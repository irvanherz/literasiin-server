/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStorytellingCategoryDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  priority: number;
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateStorytellingCategoryDto extends PartialType(
  CreateStorytellingCategoryDto,
) {}

export class BulkUpdateStorytellingCategoryEntryDto extends PartialType(
  CreateStorytellingCategoryDto,
) {
  @IsNumber()
  id: number;
}

export class BulkUpdateStorytellingCategoryDto {
  @IsOptional()
  @IsArray()
  data: BulkUpdateStorytellingCategoryEntryDto[];
}

export class StorytellingCategoryFilter {
  @IsOptional()
  @IsNumber()
  search: string;
  @IsOptional()
  @IsNumber()
  page: number = 1;
  @IsOptional()
  @IsNumber()
  limit: number = 100;
  @IsOptional()
  @IsString()
  sortBy: string = 'priority';
  @IsOptional()
  @IsString()
  sortOrder: string = 'asc';
}
