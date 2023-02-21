/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StoryCategoryFiltersDto {
  @IsOptional()
  @IsNumber()
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
