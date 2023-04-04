import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import * as moment from 'moment-timezone';

export class SignupWithEmailDto {
  @IsEmail()
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
  @Transform(({ value }) => moment(value).toDate())
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
