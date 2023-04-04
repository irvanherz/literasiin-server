import { IsOptional, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
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
