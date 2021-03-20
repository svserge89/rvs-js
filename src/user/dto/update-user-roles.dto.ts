import {Transform} from 'class-transformer';
import {IsBoolean, IsNotEmpty} from 'class-validator';

import {toBoolean} from '../../utils/sanitize';

export class UpdateUserRolesDto {
  @IsNotEmpty()
  @IsBoolean()
  @Transform(toBoolean)
  isUser: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(toBoolean)
  isAdmin: boolean;
}
