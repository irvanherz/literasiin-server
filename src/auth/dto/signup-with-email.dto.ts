import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupWithEmailDto {
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  fullName: string;
  @IsString()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';
  @IsOptional()
  @IsDateString()
  dob?: Date;
  @MinLength(6)
  password: string;
}
