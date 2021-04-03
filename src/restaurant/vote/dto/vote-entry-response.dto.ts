import {DateTimeFormatter, LocalDateTime} from '@js-joda/core';

import {VoteEntryEntity} from '../entity/vote-entry.entity';

export interface VoteEntryResponseDto {
  restaurant: {
    id: string;
    name: string;
  };

  dateTime: string;
}

export function toVoteEntryResponseDto({
  restaurant: {id, name},
  date,
  time,
}: VoteEntryEntity): VoteEntryResponseDto {
  return {
    restaurant: {id, name},
    dateTime: LocalDateTime.of(date, time).format(
      DateTimeFormatter.ISO_LOCAL_DATE_TIME,
    ),
  };
}
