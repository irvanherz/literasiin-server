import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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
