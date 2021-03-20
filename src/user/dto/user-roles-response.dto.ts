import {UserRole} from '../types/user-role.enum';

export interface UserRolesResponseDto {
  id: string;
  isUser: boolean;
  isAdmin: boolean;
}

export function toUserRolesResponseDto(id: string, roles: UserRole[]) {
  return {
    id,
    isUser: roles.includes(UserRole.USER),
    isAdmin: roles.includes(UserRole.ADMIN),
  };
}
