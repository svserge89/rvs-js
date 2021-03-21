import {BaseEntity, SelectQueryBuilder} from 'typeorm';

export function configFilter<E extends BaseEntity>(
  queryBuilder: SelectQueryBuilder<E>,
  filter: string,
  fields: string[],
): SelectQueryBuilder<E> {
  let query: string;

  for (const field of fields) {
    query = query ? query + ' OR ' : '';
    query += `${queryBuilder.alias}.${field} ILIKE :filter`;
  }

  return queryBuilder.andWhere(`(${query})`, {filter: `%${filter}%`});
}
