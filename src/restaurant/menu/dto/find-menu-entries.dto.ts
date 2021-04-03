import {Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

import {IsValidFields} from '../../../decorators/is-valid-fields.decorator';
import {IsValidSort} from '../../../decorators/is-valid-sort.decorator';
import {FindWithDateDto} from '../../../dto/find-with-date.dto';
import {split} from '../../../utils/sanitize';
import {DishEntity} from '../../dish/entity/dish.entity';
import {MenuEntryEntity} from '../entity/menu-entry.entity';

export class FindMenuEntriesDto extends FindWithDateDto {
  @IsOptional()
  @IsValidSort<MenuEntryEntity & DishEntity>(['name', 'description', 'price'])
  @Transform(split)
  sort?: string[];

  @IsOptional()
  @IsValidFields<MenuEntryEntity & DishEntity>(['name', 'description'])
  @Transform(split)
  filterFields?: string[];
}
