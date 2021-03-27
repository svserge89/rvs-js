import {Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

import {IsValidFields} from '../../../decorators/is-valid-fields.decorator';
import {IsValidSort} from '../../../decorators/is-valid-sort.decorator';
import {FindWithDateDto} from '../../../dto/find-with-date.dto';
import {split} from '../../../utils/sanitize';
import {DishEntity} from '../entity/dish.entity';

export class FindDishesDto extends FindWithDateDto {
  @IsOptional()
  @IsValidSort<DishEntity>(['name', 'description', 'date'])
  @Transform(split)
  sort?: string[];

  @IsOptional()
  @IsValidFields<DishEntity>(['name', 'description'])
  @Transform(split)
  filterFields?: string[];
}
