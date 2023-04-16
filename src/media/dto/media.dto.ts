/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class MediaFilterDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter = 'me';
  @IsOptional()
  @IsString()
  type?: string;
  @IsOptional()
  @IsString()
  tag?: string;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsNumber()
  page?: number = 1;
  @IsOptional()
  @IsNumber()
  limit?: number = 16;
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder?: string = 'desc';
}

export class CreateMediaDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter;
  @IsString()
  preset: string;
}

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
