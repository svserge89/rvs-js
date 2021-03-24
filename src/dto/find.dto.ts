import {Transform} from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {NAME_LENGTH} from '../utils/database';
import {MAX_PAGE_SIZE, MIN_PAGE, MIN_PAGE_SIZE} from '../utils/pagination';
import {toInteger, trim} from '../utils/sanitize';

export class FindDto {
  @IsOptional()
  @IsInt()
  @Min(MIN_PAGE)
  @Transform(toInteger)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(MIN_PAGE_SIZE)
  @Max(MAX_PAGE_SIZE)
  @Transform(toInteger)
  size?: number;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(NAME_LENGTH)
  @Transform(trim)
  filter?: string;
}
