import {IsOptional, MaxLength} from 'class-validator';

import {IsStrongPassword} from '../../decorators/is-strong-password.decorator';
import {PasswordDto} from '../../dto/password.dto';
import {PASSWORD_MAX_LENGTH} from '../../utils/security';

export class UpdateUserPasswordDto extends PasswordDto {
  @IsOptional()
  @MaxLength(PASSWORD_MAX_LENGTH)
  @IsStrongPassword()
  oldPassword?: string;
}
