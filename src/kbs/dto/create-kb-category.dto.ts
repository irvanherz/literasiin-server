/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKbCategoryDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  priority: number;
  @IsOptional()
  @IsString()
  description?: string;
}
