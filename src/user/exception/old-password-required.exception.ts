import {BadRequestException} from '@nestjs/common';

export class OldPasswordRequiredException extends BadRequestException {
  constructor() {
    super('oldPassword field is required for non-admins');
  }
}
