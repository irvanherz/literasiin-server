/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ExtendedFilter } from 'src/libs/validations';

export class ArticleFilterDto {
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
  @IsString()
  status?: ExtendedFilter<'draft' | 'published'> = 'published';
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
