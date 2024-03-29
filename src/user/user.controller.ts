import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {FileInterceptor} from '@nestjs/platform-express';

import {GetUserPayload} from '../auth/decorators/get-user-payload.decorator';
import {RoleAdminOrCurrentUser} from '../auth/decorators/role-admin-or-current-user.decorator';
import {RoleAdmin} from '../auth/decorators/role-admin.decorator';
import {RolesGuard} from '../auth/guards/roles.guard';
import {UserPayload} from '../auth/types/user-payload.interface';
import {ImageValidationPipe} from '../image/pipe/image-validation.pipe';
import {FindVoteEntriesByUserDto} from '../restaurant/vote/dto/find-vote-entries-by-user.dto';
import {VoteEntryPageResponseDto} from '../restaurant/vote/dto/vote-entry-page-response.dto';
import {VoteService} from '../restaurant/vote/vote.service';
import {CreateUserDto} from './dto/create-user.dto';
import {FindUsersDto} from './dto/find-users.dto';
import {UpdateUserPasswordDto} from './dto/update-user-password.dto';
import {UpdateUserRolesDto} from './dto/update-user-roles.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserPageResponseDto} from './dto/user-page-response.dto';
import {UserResponseDto} from './dto/user-response.dto';
import {UserRolesResponseDto} from './dto/user-roles-response.dto';
import {UserService} from './user.service';

@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly voteService: VoteService,
  ) {}

  @Post()
  @RoleAdmin()
  create(
    @Body(new ValidationPipe({transform: true})) userDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.create(userDto);
  }

  @Patch(':id')
  @RoleAdminOrCurrentUser()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({transform: true})) userDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, userDto);
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

  @Put(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RoleAdminOrCurrentUser()
  updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) passwordDto: UpdateUserPasswordDto,
    @GetUserPayload() userPayload: UserPayload,
  ): Promise<void> {
    return this.userService.updatePassword(id, passwordDto, userPayload);
  }

  @Put(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @RoleAdminOrCurrentUser()
  uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ): Promise<void> {
    return this.userService.updateImage(id, image);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RoleAdmin()
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RoleAdminOrCurrentUser()
  removeImage(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.removeImage(id);
  }

  @Get(':id')
  @RoleAdminOrCurrentUser()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Get()
  @RoleAdmin()
  find(
    @Query(new ValidationPipe({transform: true}))
    usersDto: FindUsersDto,
  ): Promise<UserPageResponseDto> {
    return this.userService.find(usersDto);
  }

  @Get(':id/votes')
  @RoleAdminOrCurrentUser()
  findVotes(
    @Param('id', ParseUUIDPipe) id: string,

    @Query(new ValidationPipe({transform: true}))
    findVotesDto: FindVoteEntriesByUserDto,
  ): Promise<VoteEntryPageResponseDto> {
    return this.voteService.findByUser(id, findVotesDto);
  }
}
