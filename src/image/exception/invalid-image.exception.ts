import {BadRequestException} from '@nestjs/common';

export class InvalidImageException extends BadRequestException {
  constructor() {
    super(`Invalid image file`);
  }
}
