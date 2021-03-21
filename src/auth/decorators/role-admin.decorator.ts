import {SetMetadata} from '@nestjs/common';

export function RoleAdmin() {
  return SetMetadata('isAdmin', true);
}
