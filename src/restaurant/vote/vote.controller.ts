import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {GetUserPayload} from '../../auth/decorators/get-user-payload.decorator';
import {RoleUser} from '../../auth/decorators/role-user.decorator';
import {RolesGuard} from '../../auth/guards/roles.guard';
import {UserPayload} from '../../auth/types/user-payload.interface';
import {VoteService} from './vote.service';

@Controller('restaurant/:restaurantId/vote')
@UseGuards(AuthGuard(), RolesGuard)
@RoleUser()
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @GetUserPayload() userPayload: UserPayload,
  ): Promise<void> {
    return this.voteService.create(userPayload.id, restaurantId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @GetUserPayload() userPayload: UserPayload,
  ): Promise<void> {
    return this.voteService.delete(userPayload.id, restaurantId);
  }
}
