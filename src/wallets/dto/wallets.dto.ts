import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  IdFilter,
  IdFilterValidatorConstraint,
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

export class WalletFilterDto {
  @IsOptional()
  @Validate(UserIdFilterValidatorConstraint)
  userId?: UserIdFilter;
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

export class WalletWithdrawalFilter {
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

export class WalletDepositDto {
  @IsNumber()
  amount: number;
}

export class CreateWalletWithdrawalDto {
  @IsNumber()
  walletId: number;
  @IsNumber()
  amount: number;
}

export class UpdateWalletWithdrawalDto {
  @IsIn(['canceled', 'rejected', 'processing', 'completed'])
  status: 'rejected' | 'canceled' | 'processing' | 'completed';
}
