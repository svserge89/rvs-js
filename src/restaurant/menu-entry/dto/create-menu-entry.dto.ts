import {LocalDate} from '@js-joda/core';
import {Transform} from 'class-transformer';
import {IsOptional, IsUUID, Matches} from 'class-validator';

import {IsLocalDate} from '../../../decorators/is-local-date.decorator';
import {DECIMAL_REGEX} from '../../../utils/database';
import {toLocalDate, trim} from '../../../utils/sanitize';

export class CreateMenuEntryDto {
  @IsUUID()
  @Transform(trim)
  dishId: string;

  @Matches(DECIMAL_REGEX)
  @Transform(trim)
  price: string;

  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  date?: LocalDate;
}
