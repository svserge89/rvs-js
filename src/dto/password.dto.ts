import {MaxLength} from 'class-validator';

import {IsStrongPassword} from '../decorators/is-strong-password.decorator';
import {PASSWORD_MAX_LENGTH} from '../utils/security';

export class PasswordDto {
  @MaxLength(PASSWORD_MAX_LENGTH)
  @IsStrongPassword()
  password: string;
}
