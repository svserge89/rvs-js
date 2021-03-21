import {Transform} from 'class-transformer';
import {IsInt, IsOptional, Max, Min} from 'class-validator';

import {MAX_PAGE_SIZE, MIN_PAGE, MIN_PAGE_SIZE} from '../utils/pagination';
import {toInteger} from '../utils/sanitize';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(MIN_PAGE)
  @Transform(toInteger)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(MIN_PAGE_SIZE)
  @Max(MAX_PAGE_SIZE)
  @Transform(toInteger)
  size: number;
}
