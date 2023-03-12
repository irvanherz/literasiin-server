/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class KbFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsNumber()
  categoryId?: number;
  @IsOptional()
  @IsNumber()
  userId?: number;
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
