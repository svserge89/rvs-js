import {DateTimeFormatter} from '@js-joda/core';
import {ConflictException} from '@nestjs/common';

import {MAX_VOTE_TIME} from '../../../utils/datetime';

export class VoteEntryChangeRestrictedException extends ConflictException {
  constructor() {
    super(
      `Cannot change vote after ${MAX_VOTE_TIME.format(
        DateTimeFormatter.ISO_LOCAL_TIME,
      )}`,
    );
  }
}
