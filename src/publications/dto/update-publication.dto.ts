import { PartialType } from '@nestjs/swagger';
import { CreatePublicationDto } from './create-publication.dto';

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}
