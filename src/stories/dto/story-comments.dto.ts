/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class CreateStoryCommentDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter = 'me';
  @IsNumber()
  storyId?: number;
  @IsNumber()
  chapterId?: number;
  @IsString()
  comment: string;
  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class UpdateStoryCommentDto {
  @IsOptional()
  @IsString()
  comment: string;
}

export class StoryCommentFilterDto {
  @IsOptional()
  @IsNumber()
  userId: number;
  @IsOptional()
  @IsNumber()
  storyId: number;
  @IsOptional()
  @IsNumber()
  chapterId: number;
  @IsOptional()
  @IsNumber()
  parentId: number;
  @IsOptional()
  @IsNumber()
  page: number = 1;
  @IsOptional()
  @IsNumber()
  limit: number = 5;
  @IsOptional()
  @IsString()
  sortBy = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder = 'desc';
}
