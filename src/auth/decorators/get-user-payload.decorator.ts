import {createParamDecorator, ExecutionContext} from '@nestjs/common';

import {UserPayload} from '../types/user-payload.interface';

export const GetUserPayload = createParamDecorator(
  (_, ctx: ExecutionContext): UserPayload => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
