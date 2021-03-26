import {BadRequestException} from '@nestjs/common';

export class RestaurantInvalidNameException extends BadRequestException {
  constructor(name: string) {
    super(`Restaurant name has an invalid "${name}" value`);
  }
}
