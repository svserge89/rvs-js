import {BadRequestException} from '@nestjs/common';

export class UserInvalidEmailException extends BadRequestException {
  constructor(email: string) {
    super(`Email has an invalid "${email}" value`);
  }
}
