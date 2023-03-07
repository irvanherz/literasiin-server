import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateConfigurationDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
  @Transform((params) => JSON.parse(params.value))
  @IsObject()
  value: any;
}
