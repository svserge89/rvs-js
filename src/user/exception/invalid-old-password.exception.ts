import {ConflictException} from '@nestjs/common';

export class InvalidOldPasswordException extends ConflictException {
  constructor() {
    super('Invalid old password');
  }
}
