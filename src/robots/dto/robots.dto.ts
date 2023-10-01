import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

export class FixGrammarDto {
  @IsString()
  text: string;
}

class Chapter {
  @IsString()
  title: string;
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  outlines: string[];
}

export class BuildStoryDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @ValidateNested({ each: true })
  @Type(() => Chapter)
  chapters: Chapter[];
}
