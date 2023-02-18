/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MediaFiltersDto {
  @IsOptional()
  @IsString()
  type?: string;
  @IsOptional()
  @IsString()
  tag?: string;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsNumber()
  page?: number = 1;
  @IsOptional()
  @IsNumber()
  limit?: number = 16;
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder?: string = 'desc';
}
