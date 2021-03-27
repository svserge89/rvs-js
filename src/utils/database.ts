import {LocalDate} from '@js-joda/core';
import {BaseEntity, Repository, SelectQueryBuilder} from 'typeorm';

import {configDateFilter} from './datetime';
import {configFilter} from './filter';
import {DEFAULT_PAGE, DEFAULT_SIZE, findSkip, MIN_PAGE} from './pagination';
import {configSort} from './sort';

export const NAME_LENGTH = 100;
export const EMAIL_LENGTH = 100;
export const URL_LENGTH = 100;
export const ENCRYPTED_PASSWORD_LENGTH = 60;
export const UNIQUE_VIOLATION = '23505';
export const CHECK_VIOLATION = '23514';

export function configSelect<E extends BaseEntity>(
  queryBuilder: SelectQueryBuilder<E>,
  select: string[],
): SelectQueryBuilder<E> {
  return queryBuilder.select(
    select.map((field) => `${queryBuilder.alias}.${field}`),
  );
}

export type FindQueryBuilderOptions = {
  page?: number;
  size?: number;
  filter?: string;
  filterFields?: string[];
  sort?: string[];
  date?: LocalDate;
  minDate?: LocalDate;
  maxDate?: LocalDate;
};

export function createFindQueryBuilder<E extends BaseEntity>(
  repository: Repository<E>,
  {
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    filter,
    filterFields,
    sort,
    date,
    minDate,
    maxDate,
  }: FindQueryBuilderOptions,
): SelectQueryBuilder<E> {
  let queryBuilder = repository.createQueryBuilder().take(size);

  if (page !== MIN_PAGE) {
    queryBuilder = queryBuilder.skip(findSkip(page, size));
  }

  queryBuilder = configDateFilter(queryBuilder, {date, minDate, maxDate});

  if (filter) {
    queryBuilder = configFilter(queryBuilder, filter, filterFields);
  }

  if (sort) {
    queryBuilder = configSort(queryBuilder, sort);
  }

  return queryBuilder;
}
