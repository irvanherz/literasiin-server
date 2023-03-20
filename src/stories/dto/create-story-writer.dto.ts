import { IsNumber } from 'class-validator';

export class CreateStoryWriterDto {
  @IsNumber()
  storyId: number;
  @IsNumber()
  userId: number;
}
