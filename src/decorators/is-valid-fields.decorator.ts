import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

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
