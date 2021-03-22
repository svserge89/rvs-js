import {SetMetadata} from '@nestjs/common';

export function RoleAdminOrCurrentUser() {
  return SetMetadata('isAdminOrCurrentUser', true);
}
