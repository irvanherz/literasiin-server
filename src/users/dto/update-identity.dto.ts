import { PartialType } from '@nestjs/mapped-types';
import { CreateIdentityDto } from './create-identity.dto';

export class UpdateIdentityDto extends PartialType(CreateIdentityDto) {}
