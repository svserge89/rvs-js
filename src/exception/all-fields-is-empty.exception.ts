import {BadRequestException} from '@nestjs/common';

export class AllFieldsIsEmptyException extends BadRequestException {
  constructor() {
    super('All fields is empty');
  }
}
