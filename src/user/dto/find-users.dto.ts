import {Transform} from 'class-transformer';
import {IsNotEmpty, IsOptional} from 'class-validator';

import {PaginationDto} from '../../dto/pagination.dto';
import {split, trim} from '../../utils/sanitize';
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
}
