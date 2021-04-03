import {NotFoundException} from '@nestjs/common';

export class MenuEntryNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Menu entry with id "${id}" not exists`);
  }
}
