import {PageResponseDto, toPageResponseDto} from '../../dto/page-response.dto';
import {UserEntity} from '../entity/user.entity';
import {toUserResponseDto, UserResponseDto} from './user-response.dto';

export type UserPageResponseDto = PageResponseDto<UserResponseDto>;

export const toUserPageResponseDto = (
  content: UserEntity[],
  page: number,
  size: number,
  total: number,
) => toPageResponseDto(toUserResponseDto, content, page, size, total);
