import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

import {UserPayload} from '../types/user-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isUser = this.reflector.get<boolean>('isUser', ctx.getHandler());
    const isAdmin = this.reflector.get<boolean>('isAdmin', ctx.getHandler());
    const user = ctx.switchToHttp().getRequest().user as UserPayload;

    return (isUser ? user.isUser : true) && (isAdmin ? user.isAdmin : true);
  }
}
