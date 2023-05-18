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
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

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
