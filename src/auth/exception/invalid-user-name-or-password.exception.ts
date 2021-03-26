import {UnauthorizedException} from '@nestjs/common';

export class InvalidUserNameOrPasswordException extends UnauthorizedException {
  constructor() {
    super('Invalid username or password');
  }
}
