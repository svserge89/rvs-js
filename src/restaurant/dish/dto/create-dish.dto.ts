import {LocalDate} from '@js-joda/core';
import {Transform} from 'class-transformer';
import {IsNotEmpty, IsOptional, MaxLength} from 'class-validator';

import {IsLocalDate} from '../../../decorators/is-local-date.decorator';
import {NAME_LENGTH} from '../../../utils/database';
import {toLocalDate, trim} from '../../../utils/sanitize';

export class CreateDishDto {
  @IsNotEmpty()
  @MaxLength(NAME_LENGTH)
  @Transform(trim)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  description?: string;

  @IsOptional()
  @IsLocalDate()
  @Transform(toLocalDate)
  date?: LocalDate;
}
