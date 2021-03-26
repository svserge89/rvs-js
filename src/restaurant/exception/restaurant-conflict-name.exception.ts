import {ConflictException} from '@nestjs/common';

export class RestaurantConflictNameException extends ConflictException {
  constructor(name: string) {
    super(`Restaurant with name "${name}" already exists`);
  }
}
