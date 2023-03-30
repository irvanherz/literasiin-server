/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  IdFilter,
  IdFilterValidatorConstraint,
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class StoryWriterFilterDto {
  @IsOptional()
  @Validate(IdFilterValidatorConstraint)
  storyId: IdFilter;
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
