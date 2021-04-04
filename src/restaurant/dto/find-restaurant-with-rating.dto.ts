import {LocalDate} from '@js-joda/core';
import {Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

import {IsLocalDate} from '../../decorators/is-local-date.decorator';
import {toLocalDate} from '../../utils/sanitize';

export class FindRestaurantWithRatingDto {
  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  ratingDate?: LocalDate;

  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  ratingMinDate?: LocalDate;

  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  ratingMaxDate?: LocalDate;
}
