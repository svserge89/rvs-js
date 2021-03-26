import {DateTimeFormatter, LocalDate} from '@js-joda/core';
import {ValueTransformer} from 'typeorm';

export class DateTransformer implements ValueTransformer {
  from(date: string): LocalDate {
    return LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
  }

  to(localDate: LocalDate): string {
    return localDate?.format(DateTimeFormatter.ISO_LOCAL_DATE);
  }
}
