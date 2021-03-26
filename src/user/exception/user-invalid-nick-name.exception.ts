import {BadRequestException} from '@nestjs/common';

export class UserInvalidNickNameException extends BadRequestException {
  constructor(nickName: string) {
    super(`Nickname has an invalid "${nickName}" value`);
  }
}
