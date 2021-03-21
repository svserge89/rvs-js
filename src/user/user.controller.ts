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
  ValidationPipe,
} from '@nestjs/common';

import {CreateUserDto} from './dto/create-user.dto';
import {FindUsersDto} from './dto/find-users.dto';
import {UpdateUserRolesDto} from './dto/update-user-roles.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserPageResponseDto} from './dto/user-page-response.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {UserRolesResponseDto} from './dto/user-roles-response.dto';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body(ValidationPipe) userDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.create(userDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) userDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, userDto);
  }

  @Put(':id/roles')
  updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({transform: true}))
    userRolesDto: UpdateUserRolesDto,
  ): Promise<UserRolesResponseDto> {
    return this.userService.updateRoles(id, userRolesDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Get()
  find(
    @Query(new ValidationPipe({transform: true}))
    usersDto: FindUsersDto,
  ): Promise<UserPageResponseDto> {
    return this.userService.find(usersDto);
  }
}
