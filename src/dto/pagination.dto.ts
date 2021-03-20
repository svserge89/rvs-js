import {IsInt, IsOptional, Max, Min} from 'class-validator';

import {MAX_PAGE_SIZE, MIN_PAGE, MIN_PAGE_SIZE} from '../utils/pagination';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(MIN_PAGE)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(MIN_PAGE_SIZE)
  @Max(MAX_PAGE_SIZE)
  size: number;
}
