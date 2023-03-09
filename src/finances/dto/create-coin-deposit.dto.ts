import { IsNumber } from 'class-validator';

export class CreateCoinDepositDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  amount: number;
}
