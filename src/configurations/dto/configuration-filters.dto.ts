/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ConfigurationFiltersDto {
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
  sortBy: string = 'name';
  @IsOptional()
  @IsString()
  sortOrder: string = 'desc';
}
