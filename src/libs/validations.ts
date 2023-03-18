import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'user-id-filter', async: false })
export class UserIdFilterValidatorConstraint
  implements ValidatorConstraintInterface
{
  validate(text: any) {
    return (
      typeof text === 'number' ||
      /[0-9]+/.test(text) ||
      text === 'any' ||
      text === 'me'
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} has invalid value`;
  }
}

@ValidatorConstraint({ name: 'id-filter', async: false })
export class IdFilterValidatorConstraint
  implements ValidatorConstraintInterface
{
  validate(text: any) {
    return (
      typeof text === 'number' ||
      /[0-9]+/.test(text) ||
      text === 'any' ||
      text === 'me'
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} has invalid value`;
  }
}

export function sanitizeFilter(value: any, options: any = {}) {
  if (value === 'me') return options?.currentUser?.id;
  if (value === 'any') return undefined;
  return value;
}

export type UserIdFilter = number | 'any' | 'me';
export type IdFilter = number | 'any';
export type ExtendedFilter<T> = T | 'any';
