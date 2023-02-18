import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateStoryDto } from './create-story.dto';

export class UpdateStoryDto extends OmitType(PartialType(CreateStoryDto), [
  'userId',
  'status',
]) {
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: 'draft' | 'published';
}
