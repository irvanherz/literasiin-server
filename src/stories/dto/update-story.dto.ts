import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateStoryDto } from './create-story.dto';

export class UpdateStoryDto extends OmitType(PartialType(CreateStoryDto), [
  'userId',
]) {}
