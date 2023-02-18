import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export type GenderType = 'male' | 'female' | 'other';
export type RoleType = 'user' | 'admin' | 'super';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username?: string;
  @IsOptional()
  @IsNumber()
  photoId?: number;
  @IsOptional()
  @IsString()
  fullName?: string;
  @IsOptional()
  @IsString()
  bio?: string;
  @IsOptional()
  @IsDate()
  dob?: Date;
  @IsOptional()
  @IsString()
  gender?: GenderType;
  @IsOptional()
  @IsString()
  role: RoleType = 'user';
}
