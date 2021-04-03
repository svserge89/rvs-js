import {LocalDate} from '@js-joda/core';
import {Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

import {IsLocalDate} from '../../../decorators/is-local-date.decorator';
import {toLocalDate} from '../../../utils/sanitize';

export class FindRatingDto {
  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  date?: LocalDate;

  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  minDate?: LocalDate;

  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  maxDate?: LocalDate;
}
