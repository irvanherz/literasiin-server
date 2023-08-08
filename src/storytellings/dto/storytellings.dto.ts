/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import {
  ExtendedFilter,
  IdFilter,
  IdFilterValidatorConstraint,
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class CreateStorytellingDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsNumber()
  categoryId?: number;
  @IsOptional()
  @IsNumber()
  coverId?: number;
  @IsOptional()
  @IsBoolean()
  hasCompleted?: boolean;
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';
}

export class UpdateStorytellingDto extends PartialType(CreateStorytellingDto) {}

export class StorytellingFilter {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  status?: ExtendedFilter<'draft' | 'published'> = 'published';
  @ValidateIf((e) => e.userId)
  @Validate(UserIdFilterValidatorConstraint)
  userId?: UserIdFilter;
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  bookmarkedByUserId?: UserIdFilter;
  @IsOptional()
  @Validate(IdFilterValidatorConstraint)
  categoryId?: IdFilter;
  @IsOptional()
  @IsNumber()
  page: number = 1;
  @IsOptional()
  @IsNumber()
  limit: number = 10;
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder: string = 'desc';
}
