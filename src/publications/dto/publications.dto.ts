import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, Validate } from 'class-validator';
import { CreateCategoryDto } from 'src/articles/dto/create-category.dto';
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
}

export class UpdatePublicationDto extends PartialType(CreateCategoryDto) {}
