import {ConflictException} from '@nestjs/common';

export class DishConflictNameException extends ConflictException {
  constructor(name: string) {
    super(`Dish with name "${name}" already exists`);
  }
}
