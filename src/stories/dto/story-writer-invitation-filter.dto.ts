/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  ExtendedFilter,
  IdFilter,
  IdFilterValidatorConstraint,
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class StoryWriterInvitationFilterDto {
  @IsOptional()
  @Validate(IdFilterValidatorConstraint)
  storyId: IdFilter;
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
