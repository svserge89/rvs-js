import {Transform} from 'class-transformer';
import {IsEmail, IsNotEmpty, IsOptional, MinLength} from 'class-validator';

import {PasswordDto} from '../../dto/password.dto';
import {toEmail, trim} from '../../utils/sanitize';
import {NICK_NAME_MIN_LENGTH} from '../../utils/security';

export class CreateUserDto extends PasswordDto {
  @MinLength(NICK_NAME_MIN_LENGTH)
  @Transform(trim)
  nickName: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  lastName?: string;

  @IsEmail()
  @Transform(toEmail)
  email: string;
}
