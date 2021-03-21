import {BaseEntity, SelectQueryBuilder} from 'typeorm';

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
