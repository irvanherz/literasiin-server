import { PartialType } from '@nestjs/mapped-types';
import { CreateKbCategoryDto } from './create-kb-category.dto';

export class UpdateKbCategoryDto extends PartialType(CreateKbCategoryDto) {}
