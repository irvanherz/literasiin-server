import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto, RoleType } from './create-user.dto';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'role',
]) {
  @IsOptional()
  @IsString()
  role?: RoleType;
}
