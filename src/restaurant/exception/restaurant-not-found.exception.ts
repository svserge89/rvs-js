import {NotFoundException} from '@nestjs/common';

export class RestaurantNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Restaurant with id "${id}" not exists`);
  }
}
