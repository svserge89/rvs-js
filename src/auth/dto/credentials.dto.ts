import {Transform} from 'class-transformer';
import {IsNotEmpty} from 'class-validator';

import {PasswordDto} from '../../dto/password.dto';
import {trim} from '../../utils/sanitize';

export class CredentialsDto extends PasswordDto {
  @IsNotEmpty()
  @Transform(trim)
  userName: string;
}
