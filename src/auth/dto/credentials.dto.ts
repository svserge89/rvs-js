import {Transform} from 'class-transformer';
import {IsNotEmpty, MaxLength} from 'class-validator';

import {PasswordDto} from '../../dto/password.dto';
import {NAME_LENGTH} from '../../utils/database';
import {trim} from '../../utils/sanitize';

export class CredentialsDto extends PasswordDto {
  @IsNotEmpty()
  @MaxLength(NAME_LENGTH)
  @Transform(trim)
  userName: string;
}
