import {IsOptional, Length} from 'class-validator';

import {PasswordDto} from '../../dto/password.dto';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from '../../utils/security';

export class UpdateUserPasswordDto extends PasswordDto {
  @IsOptional()
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  oldPassword: string;
}
