import { PartialType } from '@nestjs/mapped-types';

export class CreateStorytellingDto {}

export class UpdateStorytellingDto extends PartialType(CreateStorytellingDto) {}
