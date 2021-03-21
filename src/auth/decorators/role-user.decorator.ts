import {SetMetadata} from '@nestjs/common';

export function RoleUser() {
  return SetMetadata('isUser', true);
}
