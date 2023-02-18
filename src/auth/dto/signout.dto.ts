import { IsString } from 'class-validator';

export class SignOutDto {
  @IsString()
  deviceId: string;
}
