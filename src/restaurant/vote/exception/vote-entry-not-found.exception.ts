import {NotFoundException} from '@nestjs/common';

export class VoteEntryNotFoundException extends NotFoundException {
  constructor(restaurantId: string) {
    super(`Vote entry for restaurant with id "${restaurantId}" not exists`);
  }
}
