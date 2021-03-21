import {Length, Matches} from 'class-validator';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from '../utils/security';

export class PasswordDto {
  @Matches(PASSWORD_REGEX, {message: 'password is weak'})
  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  password: string;
}
