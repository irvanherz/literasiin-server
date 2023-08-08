/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  ExtendedFilter,
  IdFilter,
  IdFilterValidatorConstraint,
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class StorytellingAuthorFilter {
  @IsOptional()
  @Validate(IdFilterValidatorConstraint)
  storytellingId: IdFilter;
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter;
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
  sortOrder: string = 'desc';
}

export class StorytellingAuthorInvitationFilter {
  @IsOptional()
  @Validate(IdFilterValidatorConstraint)
  storytellingId: IdFilter;
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter;
  @IsOptional()
  @IsString()
  status: ExtendedFilter<'approved' | 'unapproved'>;
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

export class CreateStorytellingAuthorDto {
  @IsNumber()
  storytellingId: number;
  @IsNumber()
  userId: number;
}
