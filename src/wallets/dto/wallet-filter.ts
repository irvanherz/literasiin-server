import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import {
  IdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class WalletFilterDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId?: IdFilter;
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
