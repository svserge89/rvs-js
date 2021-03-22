import {registerDecorator, ValidationOptions} from 'class-validator';
import isStrongPassword from 'validator/lib/isStrongPassword';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LOWER_CASE,
  PASSWORD_MIN_NUMBERS,
  PASSWORD_MIN_SYMBOLS,
  PASSWORD_MIN_UPPER_CASE,
} from '../utils/security';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    const message = `${propertyName} is weak password`;

    registerDecorator({
      name: 'isStringPassword',
      target: object.constructor,
      propertyName,
      options: {message, ...validationOptions},
      validator: {
        validate(value) {
          return isStrongPassword(value, {
            minLength: PASSWORD_MIN_LENGTH,
            minLowercase: PASSWORD_MIN_LOWER_CASE,
            minUppercase: PASSWORD_MIN_UPPER_CASE,
            minNumbers: PASSWORD_MIN_NUMBERS,
            minSymbols: PASSWORD_MIN_SYMBOLS,
          });
        },
      },
    });
  };
}
