/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class OrderFilterDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter = 'me';
  @IsOptional()
  @IsString()
  status?: string;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsNumber()
  page?: number = 1;
  @IsOptional()
  @IsNumber()
  limit?: number = 10;
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder?: string = 'desc';
}
