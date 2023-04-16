/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateKbCategoryDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  priority: number;
  @IsOptional()
  @IsNumber()
  imageId: number;
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateKbDto {
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  @IsNumber()
  categoryId?: number;
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';
  @IsOptional()
  @IsNumber()
  imageId?: number;
}

export class UpdateKbCategoryDto extends PartialType(CreateKbCategoryDto) {}
export class UpdateKbDto extends PartialType(CreateKbDto) {}

export class BulkUpdateKbCategoryEntryDto extends PartialType(
  CreateKbCategoryDto,
) {
  @IsNumber()
  id: number;
}

export class BulkUpdateKbCategoryDto {
  @IsOptional()
  @IsArray()
  data: BulkUpdateKbCategoryEntryDto[];
}

export class KbCategoryFilterDto {
  @IsOptional()
  @IsString()
  search: string;
  @IsOptional()
  @IsNumber()
  page = 1;
  @IsOptional()
  @IsNumber()
  limit = 100;
  @IsOptional()
  @IsString()
  sortBy = 'priority';
  @IsOptional()
  @IsString()
  sortOrder = 'asc';
}

export class KbFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  status?: string;
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
