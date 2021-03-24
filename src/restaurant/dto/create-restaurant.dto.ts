import {Transform} from 'class-transformer';
import {IsNotEmpty, IsOptional, MaxLength} from 'class-validator';

import {NAME_LENGTH} from '../../utils/database';
import {trim} from '../../utils/sanitize';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @MaxLength(NAME_LENGTH)
  @Transform(trim)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  description?: string;
}
