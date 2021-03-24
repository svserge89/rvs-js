import {PageResponseDto, toPageResponseDto} from '../../dto/page-response.dto';
import {toUserResponseDto, UserResponseDto} from './user-response.dto';

export type UserPageResponseDto = PageResponseDto<UserResponseDto>;

export const toUserPageResponseDto = toPageResponseDto.bind(
  null,
  toUserResponseDto,
);
