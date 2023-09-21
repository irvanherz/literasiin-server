import { IsString } from 'class-validator';

export class FixGrammarDto {
  @IsString()
  text: string;
}
