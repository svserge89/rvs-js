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

export const DECIMAL_REGEX = /^([0-9]{1,17})+(\.[0-9]{1,2})?$/;
export const DECIMAL_PRECISION = 19;
export const DECIMAL_SCALE = 2;

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
  fieldsMap?: Map<string, string>;
  relation?: string;
  count?: {
    relation: string;
    field: string;
    entity: any;
    parent: string;
    date?: LocalDate;
    minDate?: LocalDate;
    maxDate?: LocalDate;
  };
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
    fieldsMap,
    relation,
    count,
  }: FindQueryBuilderOptions,
): SelectQueryBuilder<E> {
  let queryBuilder = repository.createQueryBuilder().take(size);

  if (relation) {
    queryBuilder = queryBuilder.leftJoinAndSelect(
      `${queryBuilder.alias}.${relation}`,
      relation,
    );
  }

  if (count) {
    const {field, relation, parent, entity, date, minDate, maxDate} = count;

    if (sort.includes(field)) {
      queryBuilder = queryBuilder.addSelect((qb) => {
        qb.select(`COUNT(*)`, field)
          .from(entity, relation)
          .where(`${relation}.${parent}.id = ${queryBuilder.alias}.id`);

        return configDateFilter(qb, {
          date,
          minDate,
          maxDate,
        });
      }, field);
    }

    queryBuilder = queryBuilder.loadRelationCountAndMap(
      `${queryBuilder.alias}.${field}`,
      `${queryBuilder.alias}.${relation}`,
      field,
      (qb) =>
        configDateFilter(qb, {
          date,
          minDate,
          maxDate,
        }),
    );
  }

  if (page !== MIN_PAGE) {
    queryBuilder = queryBuilder.skip(findSkip(page, size));
  }

  queryBuilder = configDateFilter(queryBuilder, {date, minDate, maxDate});

  if (fieldsMap) {
    filterFields = filterFields?.map((field) =>
      fieldsMap.has(field) ? fieldsMap.get(field) : field,
    );

    sort = sort?.map((field) =>
      fieldsMap.has(field) ? fieldsMap.get(field) : field,
    );
  }

  if (filter) {
    queryBuilder = configFilter(queryBuilder, filter, filterFields);
  }

  if (sort) {
    queryBuilder = configSort(queryBuilder, sort, count?.field);
  }

  return queryBuilder;
}
