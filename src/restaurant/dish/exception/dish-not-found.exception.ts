import {NotFoundException} from '@nestjs/common';

export class DishNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Dish with id "${id}" is not exists`);
  }
}
