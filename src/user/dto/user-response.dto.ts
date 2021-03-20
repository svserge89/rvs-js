import {UserEntity} from '../entity/user.entity';
import {UserRole} from '../types/user-role.enum';

export interface UserResponseDto {
  id: string;
  nickName: string;
  firstName: string;
  lastName: string;
  email: string;
  isUser: boolean;
  isAdmin: boolean;
  imageUrl: string;
}

export function toUserResponseDto({
  id,
  nickName,
  firstName,
  lastName,
  email,
  imageUrl,
  roles,
}: UserEntity): UserResponseDto {
  return {
    id,
    nickName,
    firstName,
    lastName,
    email,
    isUser: roles.includes(UserRole.USER),
    isAdmin: roles.includes(UserRole.ADMIN),
    imageUrl,
  };
}
