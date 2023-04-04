/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  ExtendedFilter,
  IdFilter,
  IdFilterValidatorConstraint,
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class ArticleFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  status?: ExtendedFilter<'draft' | 'published'> = 'published';
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter = 'any';
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
