import {ConflictException} from '@nestjs/common';

export class UserConflictNickNameException extends ConflictException {
  constructor(nickName: string) {
    super(`Nickname "${nickName}" already exists`);
  }
}
