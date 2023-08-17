/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class CreateArticleCommentDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter = 'me';
  @IsNumber()
  articleId?: number;
  @IsString()
  comment: string;
  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class UpdateArticleCommentDto {
  @IsOptional()
  @IsString()
  comment: string;
}

export class ArticleCommentFilterDto {
  @IsOptional()
  @IsNumber()
  userId: number;
  @IsOptional()
  @IsNumber()
  articleId: number;
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
