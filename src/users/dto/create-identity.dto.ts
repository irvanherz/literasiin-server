import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateIdentityDto {
  @IsNumber()
  userId: number;
  @IsString()
  type: string;
  @IsString()
  key: string;
  @IsOptional()
  @Transform((params) => JSON.parse(params.value))
  @IsObject()
  meta?: any;
}
