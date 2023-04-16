import { IsString } from 'class-validator';

export class CreatePublicationFileDto {
  @IsString()
  title: string;
}
