import {ConflictException} from '@nestjs/common';

export class UserConflictEmailException extends ConflictException {
  constructor(email: string) {
    super(`Email "${email}" already exists`);
  }
}
