import {UserEntity} from '../entity/user.entity';
import {toUserResponseDto, UserResponseDto} from './user-response.dto';

export interface UserPageResponseDto {
  content: UserResponseDto[];
  page: number;
  size: number;
  total: number;
}

export function toUserPageResponseDto(
  content: UserEntity[],
  page: number,
  size: number,
  total: number,
): UserPageResponseDto {
  return {
    content: content.map(toUserResponseDto),
    page,
    size,
    total,
  };
}
