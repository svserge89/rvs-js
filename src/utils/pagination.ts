export const MIN_PAGE = 1;
export const MIN_PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SIZE = 10;

export function findSkip(page: number, size: number): number {
  return (page - 1) * size;
}
