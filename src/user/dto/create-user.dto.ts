import {Transform} from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

import {PasswordDto} from '../../dto/password.dto';
import {EMAIL_LENGTH, NAME_LENGTH} from '../../utils/database';
import {toEmail, trim} from '../../utils/sanitize';
import {NICK_NAME_MIN_LENGTH} from '../../utils/security';

export class CreateUserDto extends PasswordDto {
  @Length(NICK_NAME_MIN_LENGTH, NAME_LENGTH)
  @Transform(trim)
  nickName: string;

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

  @IsEmail()
  @MaxLength(EMAIL_LENGTH)
  @Transform(toEmail)
  email: string;
}
