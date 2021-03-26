import {BadRequestException} from '@nestjs/common';

export class DishInvalidNameException extends BadRequestException {
  constructor(name: string) {
    super(`Dish name has an invalid "${name}" value`);
  }
}
