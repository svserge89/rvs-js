import {Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

import {IsValidFields} from '../../decorators/is-valid-fields.decorator';
import {IsValidSort} from '../../decorators/is-valid-sort.decorator';
import {FindDto} from '../../dto/find.dto';
import {split} from '../../utils/sanitize';
import {RestaurantEntity} from '../entity/restaurant.entity';

export class FindRestaurantsDto extends FindDto {
  @IsOptional()
  @IsValidSort<RestaurantEntity>(['name', 'description'])
  @Transform(split)
  sort?: string[];

  @IsOptional()
  @IsValidFields<RestaurantEntity>(['name', 'description'])
  @Transform(split)
  filterFields?: string[];
}
