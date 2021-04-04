import {BaseEntity, SelectQueryBuilder} from 'typeorm';

export const DESC_VALUE = 'DESC';

export function configSort<E extends BaseEntity>(
  queryBuilder: SelectQueryBuilder<E>,
  sort: string[],
  countField: string,
): SelectQueryBuilder<E> {
  let result = queryBuilder;

  for (let i = 0; i < sort.length; ++i) {
    const fieldWithAlias =
      sort[i].includes('.') || sort[i] === countField
        ? sort[i]
        : `${queryBuilder.alias}.${sort[i]}`;

    if (sort[i + 1] !== DESC_VALUE) {
      result = result.addOrderBy(fieldWithAlias, 'ASC');
    } else {
      result = result.addOrderBy(fieldWithAlias, 'DESC');
      ++i;
    }
  }

  return result;
}
