import {Transform} from 'class-transformer';
import {IsBoolean, IsOptional} from 'class-validator';

import {IsValidFields} from '../../decorators/is-valid-fields.decorator';
import {IsValidSort} from '../../decorators/is-valid-sort.decorator';
import {FindDto} from '../../dto/find.dto';
import {split, toBoolean} from '../../utils/sanitize';
import {UserEntity} from '../entity/user.entity';

export class FindUsersDto extends FindDto {
  @IsOptional()
  @IsValidSort<UserEntity>([
    'nickName',
    'firstName',
    'lastName',
    'email',
    'roles',
  ])
  @Transform(split)
  sort?: string[];

  @IsOptional()
  @IsValidFields<UserEntity>(['nickName', 'firstName', 'lastName', 'email'])
  @Transform(split)
  filterFields?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isUser?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isAdmin?: boolean;
}
