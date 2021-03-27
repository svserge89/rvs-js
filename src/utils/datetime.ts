import {DateTimeFormatter, LocalDate} from '@js-joda/core';
import {BaseEntity, SelectQueryBuilder, ValueTransformer} from 'typeorm';

export class DateTransformer implements ValueTransformer {
  from(date: string): LocalDate {
    return LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
  }

  to(localDate: LocalDate): string {
    return localDate?.format(DateTimeFormatter.ISO_LOCAL_DATE);
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
  if (date) {
    return queryBuilder.andWhere(`${queryBuilder.alias}.date = :date`, {
      date,
    });
  } else if (minDate && maxDate) {
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
  } else {
    return queryBuilder;
  }
}
