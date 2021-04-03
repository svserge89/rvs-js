import {ConflictException} from '@nestjs/common';

export class VoteEntryConflictUserException extends ConflictException {
  constructor(userId: string) {
    super(`Vote entry for user with id "${userId}" already exists`);
  }
}
