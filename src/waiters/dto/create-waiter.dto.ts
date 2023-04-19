import { IsEmail } from 'class-validator';

export class CreateWaiterDto {
  @IsEmail()
  email: string;
}
