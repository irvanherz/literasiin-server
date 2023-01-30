import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStoryDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
  @IsString()
  title: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published' = 'draft';
}
