import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import * as dayjs from 'dayjs';
import {
  UserIdFilter,
  UserIdFilterValidatorConstraint,
} from 'src/libs/validations';

// export class AuthWithGoogleDto {
//   @IsString()
//   idToken: string;
//   //device
//   @IsString()
//   deviceType: string;
//   @IsString()
//   deviceId: string;
//   @IsOptional()
//   @IsString()
//   notificationToken?: string;
// }

export class AuthWithGoogleDto {
  @IsString()
  code: string;
  //device
  @IsString()
  deviceType: string;
  @IsString()
  deviceId: string;
  @IsOptional()
  @IsString()
  notificationToken?: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  @IsString()
  token: string;
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @Optional()
  @Validate(UserIdFilterValidatorConstraint)
  userId: UserIdFilter;
  @IsString()
  oldPassword: string;
  @IsString()
  newPassword: string;
}

export class SigninDto {
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  username: string;
  @MinLength(6)
  password: string;
  //device
  @IsString()
  deviceType: string;
  @IsString()
  deviceId: string;
  @IsOptional()
  @IsString()
  notificationToken?: string;
}

export class SignOutDto {
  @IsString()
  deviceId: string;
}

export class SignupWithEmailDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  @IsAlphanumeric()
  username: string;
  @IsOptional()
  @IsString()
  fullName: string;
  @IsString()
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';
  @IsOptional()
  @Transform(({ value }) => dayjs(value).toDate())
  @IsDate()
  dob?: Date;
  @MinLength(6)
  password: string;
  //device
  @IsString()
  deviceType: string;
  @IsString()
  deviceId: string;
  @IsOptional()
  @IsString()
  notificationToken?: string;
}
