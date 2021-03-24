import {Transform} from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

import {NAME_LENGTH} from '../../utils/database';
import {toEmail, trim} from '../../utils/sanitize';
import {NICK_NAME_MIN_LENGTH} from '../../utils/security';

export class UpdateUserDto {
  @IsOptional()
  @Length(NICK_NAME_MIN_LENGTH, NAME_LENGTH)
  @Transform(trim)
  nickName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(NAME_LENGTH)
  @Transform(trim)
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(NAME_LENGTH)
  @Transform(trim)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(NAME_LENGTH)
  @Transform(toEmail)
  email?: string;
}
