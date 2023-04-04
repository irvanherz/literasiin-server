/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { IdFilter, IdFilterValidatorConstraint } from 'src/libs/validations';

export class WalletTransactionFilter {
  @IsOptional()
  @Validate(IdFilterValidatorConstraint)
  walletId?: IdFilter;
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
