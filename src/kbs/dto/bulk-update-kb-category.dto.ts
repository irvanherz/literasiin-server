import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { CreateKbCategoryDto } from './create-kb-category.dto';

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
