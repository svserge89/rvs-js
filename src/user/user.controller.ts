import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {GetUserPayload} from '../auth/decorators/get-user-payload.decorator';
import {RoleAdmin} from '../auth/decorators/role-admin.decorator';
import {RolesGuard} from '../auth/guards/roles.guard';
import {UserPayload} from '../auth/types/user-payload.interface';
import {CreateUserDto} from './dto/create-user.dto';
import {FindUsersDto} from './dto/find-users.dto';
import {UpdateUserRolesDto} from './dto/update-user-roles.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserPageResponseDto} from './dto/user-page-response.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {UserRolesResponseDto} from './dto/user-roles-response.dto';
import {UserService} from './user.service';

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @RoleAdmin()
  create(
    @Body(ValidationPipe) userDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.create(userDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) userDto: UpdateUserDto,
    @GetUserPayload() userPayload: UserPayload,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, userDto, userPayload);
  }

  @Put(':id/roles')
  @RoleAdmin()
  updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({transform: true}))
    userRolesDto: UpdateUserRolesDto,
  ): Promise<UserRolesResponseDto> {
    return this.userService.updateRoles(id, userRolesDto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserPayload() userPayload: UserPayload,
  ): Promise<UserResponseDto> {
    return this.userService.findOne(id, userPayload);
  }

  @Get()
  @RoleAdmin()
  find(
    @Query(new ValidationPipe({transform: true}))
    usersDto: FindUsersDto,
  ): Promise<UserPageResponseDto> {
    return this.userService.find(usersDto);
  }
}
