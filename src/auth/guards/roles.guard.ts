import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

import {UserPayload} from '../types/user-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isUser = this.reflector.get<boolean>('isUser', ctx.getHandler());
    const isAdmin = this.reflector.get<boolean>('isAdmin', ctx.getHandler());
    const isAdminOrCurrentUser = this.reflector.get<boolean>(
      'isAdminOrCurrentUser',
      ctx.getHandler(),
    );
    const request = ctx.switchToHttp().getRequest();
    const id = request.params.id;
    const user = request.user as UserPayload;

    return (
      (isUser ? user.isUser : true) &&
      (isAdmin ? user.isAdmin : true) &&
      (isAdminOrCurrentUser ? user.isAdmin || id === user.id : true)
    );
  }
}
