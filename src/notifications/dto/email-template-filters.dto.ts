import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EmailTemplateFiltersDto {
  @IsOptional()
  @IsString()
  search: string;
  @IsOptional()
  @IsNumber()
  page = 1;
  @IsOptional()
  @IsNumber()
  limit = 10;
  @IsOptional()
  @IsString()
  sortBy = 'createdAt';
  @IsOptional()
  @IsString()
  sortOrder = 'desc';
}
