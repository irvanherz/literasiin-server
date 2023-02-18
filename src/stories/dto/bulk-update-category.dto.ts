import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class BulkUpdateCategoryEntryDto extends PartialType(CreateCategoryDto) {
  @IsNumber()
  id: number;
}

export class BulkUpdateCategoryDto {
  @IsOptional()
  @IsArray()
  data: BulkUpdateCategoryEntryDto[];
}
