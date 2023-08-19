/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserMessageDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  email: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  captchaToken?: string;
  @IsString()
  message: string;
}

export class FindUserMessageFilter {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsNumber()
  page: number = 1;
  @IsOptional()
  @IsNumber()
  limit: number = 10;
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder: string = 'desc';
}
