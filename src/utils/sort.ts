import {BaseEntity, FindManyOptions} from 'typeorm';

export const DESC_VALUE = 'DESC';

export function configSort<E extends BaseEntity>(
  sort: string[],
): FindManyOptions<E>['order'] {
  let prev = '';

  const result: FindManyOptions<E>['order'] = {};

  for (const sortField of sort) {
    if (sortField !== DESC_VALUE) {
      result[sortField] = 'ASC';
      prev = sortField;
    } else {
      result[prev] = 'DESC';
    }
  }

  return result;
}
