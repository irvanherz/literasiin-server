import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  priority?: number = 0;
}
