import {ConflictException} from '@nestjs/common';

export class MenuEntryConflictDishException extends ConflictException {
  constructor(id: string) {
    super(`Entry with id "${id}" already exists`);
  }
}
