/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/mapped-types';
import {
  IsLatLong,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class UserAddressFilterDto {
  @IsOptional()
  @IsString()
  userId?: string;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsNumber()
  page?: number = 1;
  @IsOptional()
  @IsNumber()
  limit?: number = 50;
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder?: string = 'desc';
}

export class CreateUserAddressDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter;
  @IsString()
  type?: string;
  @IsNumber()
  postalCode?: number;
  @IsLatLong()
  location?: string;
  @IsString()
  phone?: string;
  @IsString()
  address?: string;
  @IsOptional()
  @IsObject()
  meta?: Date;
}

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}
