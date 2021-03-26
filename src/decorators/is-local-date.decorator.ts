import {LocalDate} from '@js-joda/core';
import {registerDecorator, ValidationOptions} from 'class-validator';

export function IsLocalDate(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    const message = `${propertyName} is invalid ISO date`;

    registerDecorator({
      name: 'isLocalDate',
      target: object.constructor,
      propertyName,
      options: {message, ...validationOptions},
      validator: {
        validate(value) {
          return value instanceof LocalDate;
        },
      },
    });
  };
}
