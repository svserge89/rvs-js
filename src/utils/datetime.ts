import {DateTimeFormatter, LocalDate, LocalTime} from '@js-joda/core';
import {BaseEntity, SelectQueryBuilder, ValueTransformer} from 'typeorm';
import {get as getConfig} from 'config';

import {ApplicationConfig} from '../config/types/application-config.interface';

export const MIN_DATE = LocalDate.of(1, 1, 1);
export const MAX_DATE = LocalDate.of(3000, 1, 1);

export const MAX_VOTE_TIME = LocalTime.parse(
  getConfig<ApplicationConfig>('application').maxVoteTime,
  DateTimeFormatter.ISO_LOCAL_TIME,
);

export function checkVoteTime(): boolean {
  return LocalTime.now().compareTo(MAX_VOTE_TIME) <= 0;
}

export class DateTransformer implements ValueTransformer {
  from(date: string): LocalDate {
    return LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
  }

  to(localDate: LocalDate): string {
    return localDate?.format(DateTimeFormatter.ISO_LOCAL_DATE);
  }
}

export class TimeTransformer implements ValueTransformer {
  from(time: string): LocalTime {
    return LocalTime.parse(time, DateTimeFormatter.ISO_LOCAL_TIME);
  }

  to(localTime: LocalTime): string {
    return localTime?.format(DateTimeFormatter.ISO_LOCAL_TIME);
  }
}

export type ConfigDateFilterOptions = {
  date?: LocalDate;
  minDate?: LocalDate;
  maxDate?: LocalDate;
};

export function configDateFilter<E extends BaseEntity>(
  queryBuilder: SelectQueryBuilder<E>,
  {date, minDate, maxDate}: ConfigDateFilterOptions,
): SelectQueryBuilder<E> {
  if (minDate && maxDate) {
    return queryBuilder.andWhere(
      `(${queryBuilder.alias}.date BETWEEN :minDate AND :maxDate)`,
      {minDate, maxDate},
    );
  } else if (minDate) {
    return queryBuilder.andWhere(`${queryBuilder.alias}.date >= :minDate`, {
      minDate,
    });
  } else if (maxDate) {
    return queryBuilder.andWhere(`${queryBuilder.alias}.date <= :maxDate`, {
      maxDate,
    });
  } else if (date) {
    return queryBuilder.andWhere(`${queryBuilder.alias}.date = :date`, {
      date,
    });
  } else {
    return queryBuilder;
  }
}
