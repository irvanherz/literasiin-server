import { IsOptional, IsString } from 'class-validator';

export class AuthWithGoogleDto {
  @IsString()
  idToken: string;
  //device
  @IsString()
  deviceType: string;
  @IsString()
  deviceId: string;
  @IsOptional()
  @IsString()
  notificationToken?: string;
}
