import {Transform} from 'class-transformer';
import {IsBoolean, IsNotEmpty, IsOptional} from 'class-validator';

import {PaginationDto} from '../../dto/pagination.dto';
import {split, trim, toBoolean} from '../../utils/sanitize';
import {IsValidFields, IsValidSort} from '../../utils/validation';
import {UserEntity} from '../entity/user.entity';

export class FindUsersDto extends PaginationDto {
  @IsOptional()
  @IsValidSort<UserEntity>([
    'nickName',
    'firstName',
    'lastName',
    'email',
    'roles',
  ])
  @Transform(split)
  sort: string[];

  @IsOptional()
  @IsNotEmpty()
  @Transform(trim)
  filter: string;

  @IsOptional()
  @IsValidFields<UserEntity>(['nickName', 'firstName', 'lastName', 'email'])
  @Transform(split)
  filterFields: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isUser: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isAdmin: boolean;
}
