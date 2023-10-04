/* eslint-disable @typescript-eslint/no-inferrable-types */
import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
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

export class CreateStoryDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId?: UserIdFilter = 'me';
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
  @IsString()
  languageId?: string;
  @IsOptional()
  @IsArray()
  tags?: string[];
  @IsOptional()
  @IsBoolean()
  hasCompleted?: boolean;
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';
}

export class UpdateStoryDto extends OmitType(CreateStoryDto, ['userId']) {}

export class StoryFilterDto {
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

export class CreateTagDto {
  @IsString()
  name: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class UpdateChapterMetaDto {}
