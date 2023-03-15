import {
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'user-id-filter', async: false })
export class UserIdValidatorConstraint implements ValidatorConstraintInterface {
  validate(text: any) {
    return (
      typeof text === 'number' ||
      /[0-9]+/.test(text) ||
      text === 'any' ||
      text === 'me'
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} has invalid value`;
  }
}

export class WalletFilterDto {
  @IsOptional()
  @Validate(UserIdValidatorConstraint)
  userId?: number | 'any' | 'me';
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
