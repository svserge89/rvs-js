import {Transform} from 'class-transformer';
import {IsEmail, IsNotEmpty, IsOptional, MinLength} from 'class-validator';

import {trim} from '../../utils/sanitize';
import {NICK_NAME_MIN_LENGTH} from '../../utils/security';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(NICK_NAME_MIN_LENGTH)
  @Transform(trim)
  nickName?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @Transform(trim)
  email?: string;
}
