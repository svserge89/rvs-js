import {Transform} from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

import {trim} from '../../utils/sanitize';
import {
  NICK_NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from '../../utils/security';

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

  @IsOptional()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  @Matches(PASSWORD_REGEX, {message: 'password is weak'})
  password?: string;
}
