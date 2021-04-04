import {get as getConfig} from 'config';

import {ApplicationConfig} from '../config/types/application-config.interface';

const config = getConfig<ApplicationConfig>('application');

export const MIN_PAGE = 1;
export const MIN_PAGE_SIZE = config.minPageSize;
export const MAX_PAGE_SIZE = config.maxPageSize;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SIZE = config.pageSize;

export function findSkip(page: number, size: number): number {
  return (page - 1) * size;
}
