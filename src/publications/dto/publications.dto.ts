/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  ExtendedFilter,
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class PublicationFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  status?: ExtendedFilter<
    'draft' | 'payment' | 'publishing' | 'shipping' | 'published'
  >;
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter = 'me';
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

export class CreatePublicationDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter;
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  author: string;
  @IsOptional()
  @IsString()
  type: string;
  @IsOptional()
  @IsNumber()
  addressId: number;
  @IsOptional()
  @IsNumber()
  coverId: number;
  @IsOptional()
  @IsNumber()
  royalty: number;
  @IsOptional()
  @IsObject()
  meta: any;
}

export class PublicationDetailOptions {
  @IsOptional()
  @IsBoolean()
  includeAddress?: boolean = false;
}

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}
