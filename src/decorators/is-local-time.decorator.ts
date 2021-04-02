import {LocalTime} from '@js-joda/core';
import {registerDecorator, ValidationOptions} from 'class-validator';

export function IsLocalTime(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    const message = `${propertyName} is invalid ISO time`;

    registerDecorator({
      name: 'isLocalTime',
      target: object.constructor,
      propertyName,
      options: {message, ...validationOptions},
      validator: {
        validate(value) {
          return value instanceof LocalTime;
        },
      },
    });
  };
}
