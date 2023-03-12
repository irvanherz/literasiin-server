import { PartialType } from '@nestjs/swagger';
import { CreateKbDto } from './create-kb.dto';

export class UpdateKbDto extends PartialType(CreateKbDto) {}
