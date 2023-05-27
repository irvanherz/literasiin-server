/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
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
