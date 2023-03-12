/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class KbCategoryFilterDto {
  @IsOptional()
  @IsString()
  search: string;
  @IsOptional()
  @IsNumber()
  page: number = 1;
  @IsOptional()
  @IsNumber()
  limit: number = 100;
  @IsOptional()
  @IsString()
  sortBy: string = 'priority';
  @IsOptional()
  @IsString()
  sortOrder: string = 'asc';
}
