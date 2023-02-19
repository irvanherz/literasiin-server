import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateChapterDto } from './create-chapter.dto';

export class UpdateChapterDto extends OmitType(PartialType(CreateChapterDto), [
  'status',
]) {
  @IsOptional()
  @IsString()
  status: 'draft' | 'published';
}
