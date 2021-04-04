import {LocalDate} from '@js-joda/core';
import {Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

import {IsLocalDate} from '../../decorators/is-local-date.decorator';
import {IsValidFields} from '../../decorators/is-valid-fields.decorator';
import {IsValidSort} from '../../decorators/is-valid-sort.decorator';
import {FindDto} from '../../dto/find.dto';
import {split, toLocalDate} from '../../utils/sanitize';
import {RestaurantEntity} from '../entity/restaurant.entity';

export class FindRestaurantsDto extends FindDto {
  @IsOptional()
  @IsValidSort<RestaurantEntity>(['name', 'description', 'rating'])
  @Transform(split)
  sort?: string[];

  @IsOptional()
  @IsValidFields<RestaurantEntity>(['name', 'description'])
  @Transform(split)
  filterFields?: string[];

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
