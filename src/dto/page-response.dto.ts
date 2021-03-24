export interface PageResponseDto<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
}

export function toPageResponseDto<E, T>(
  toTo: (E) => T,
  content: E[],
  page,
  size,
  total,
): PageResponseDto<T> {
  return {
    content: content.map(toTo),
    page,
    size,
    total,
  };
}
