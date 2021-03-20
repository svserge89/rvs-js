import {BaseEntity, FindManyOptions, ILike} from 'typeorm';

export function configFilter<E extends BaseEntity>(
  filter: string,
  fields: string[],
): FindManyOptions<E>['where'] {
  const result: FindManyOptions<E>['where'] = [];

  for (const field of fields) {
    result.push({[field]: ILike(`%${filter}%`)});
  }

  return result;
}
