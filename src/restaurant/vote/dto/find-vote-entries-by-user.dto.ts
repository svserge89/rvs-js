import {Transform} from 'class-transformer';
import {IsOptional} from 'class-validator';

import {IsValidSort} from '../../../decorators/is-valid-sort.decorator';
import {FindWithDateDto} from '../../../dto/find-with-date.dto';
import {split} from '../../../utils/sanitize';
import {RestaurantEntity} from '../../entity/restaurant.entity';
import {VoteEntryEntity} from '../entity/vote-entry.entity';

export class FindVoteEntriesByUserDto extends FindWithDateDto {
  @IsOptional()
  @IsValidSort<VoteEntryEntity & RestaurantEntity>(['name', 'date', 'time'])
  @Transform(split)
  sort?: string[];
}
