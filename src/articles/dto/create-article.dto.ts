import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
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
  status?: 'draft' | 'published' = 'draft';
}
