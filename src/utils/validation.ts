import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import {DESC_VALUE} from './sort';

export function IsValidSort<T>(
  fields: (keyof T)[],
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    const message = `${propertyName} is invalid sorter string`;

    registerDecorator({
      name: 'isValidSort',
      target: object.constructor,
      propertyName,
      constraints: fields,
      options: {message, ...validationOptions},
      validator: {
        validate(value, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          if (!value.length || value[0] === DESC_VALUE) {
            return false;
          }

          const prev = [];

          for (const option of value) {
            if (
              option !== DESC_VALUE &&
              (prev.includes(option) || !args.constraints.includes(option))
            ) {
              return false;
            } else if (
              option === DESC_VALUE &&
              prev.lastIndexOf(DESC_VALUE) === prev.length - 1
            ) {
              return false;
            } else {
              prev.push(option);
            }
          }

          return true;
        },
      },
    });
  };
}

export function IsValidFields<T>(
  fields: (keyof T)[],
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    const message = `${propertyName} is invalid filter string`;

    registerDecorator({
      name: 'isValidFilter',
      target: object.constructor,
      propertyName,
      constraints: fields,
      options: {message, ...validationOptions},
      validator: {
        validate(value, args: ValidationArguments) {
          if (!Array.isArray(value)) {
            return false;
          }

          if (!value.length) {
            return false;
          }

          const prev = [];

          for (const option of value) {
            if (prev.includes(option) || !args.constraints.includes(option)) {
              return false;
            } else {
              prev.push(option);
            }
          }

          return true;
        },
      },
    });
  };
}
