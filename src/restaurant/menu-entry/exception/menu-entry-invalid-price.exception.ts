import {BadRequestException} from '@nestjs/common';

export class MenuEntryInvalidPriceException extends BadRequestException {
  constructor(price: string) {
    super(`Price value "${price}" is invalid`);
  }
}
