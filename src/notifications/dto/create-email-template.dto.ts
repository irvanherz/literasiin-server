import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsString()
  name: string;
  @IsString()
  subject: string;
  @IsString()
  html: string;
  @IsString()
  text: string;
  @IsOptional()
  @IsObject()
  meta: Record<string, any> = {};
}
