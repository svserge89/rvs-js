import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';

import {UserPayload} from '../auth/types/user-payload.interface';
import {
  CHECK_VIOLATION,
  configSelect,
  UNIQUE_VIOLATION,
} from '../utils/database';
import {configFilter} from '../utils/filter';
import {
  DEFAULT_PAGE,
  DEFAULT_SIZE,
  findSkip,
  MIN_PAGE,
} from '../utils/pagination';
import {checkPassword, encryptPassword} from '../utils/security';
import {configSort} from '../utils/sort';
import {CreateUserDto} from './dto/create-user.dto';
import {FindUsersDto} from './dto/find-users.dto';
import {UpdateUserPasswordDto} from './dto/update-user-password.dto';
import {UpdateUserRolesDto} from './dto/update-user-roles.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {
  toUserPageResponseDto,
  UserPageResponseDto,
} from './dto/user-page-response.dto';
import {toUserResponseDto, UserResponseDto} from './dto/user-response.dto';
import {
  toUserRolesResponseDto,
  UserRolesResponseDto,
} from './dto/user-roles-response.dto';
import {UserEntity} from './entity/user.entity';
import {UserRole} from './types/user-role.enum';

const SELECT_OPTIONS: (keyof UserEntity)[] = [
  'id',
  'nickName',
  'firstName',
  'lastName',
  'email',
  'imageUrl',
  'roles',
];

const DEFAULT_FILTER_FIELDS: (keyof UserEntity)[] = [
  'nickName',
  'firstName',
  'lastName',
  'email',
];

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create({
    nickName,
    firstName,
    lastName,
    email,
    password,
  }: CreateUserDto): Promise<UserResponseDto> {
    const encryptedPassword = await encryptPassword(password);
    const user = this.userRepository.create({
      nickName,
      email,
      encryptedPassword,
      firstName,
      lastName,
      roles: [UserRole.USER],
    });

    try {
      return toUserResponseDto(await this.userRepository.save(user));
    } catch (exception) {
      this.checkException(exception, nickName, email);
    }
  }

  async update(
    id: string,
    {nickName, firstName, lastName, email}: UpdateUserDto,
    userPayload: UserPayload,
  ): Promise<UserResponseDto> {
    UserService.checkUserRole(id, userPayload);

    if (!nickName && !firstName && !lastName && !email) {
      throw new BadRequestException('All fields is empty');
    }

    try {
      return toUserResponseDto(
        await this.userRepository.manager.transaction(async (tm) => {
          const updateFields: Partial<UserEntity> = {};

          if (nickName) {
            updateFields.nickName = nickName;
          }

          if (firstName) {
            updateFields.firstName = firstName;
          }

          if (lastName) {
            updateFields.lastName = lastName;
          }

          if (email) {
            updateFields.email = email;
          }

          const result = await tm.update(UserEntity, {id}, updateFields);

          if (!result.affected) {
            UserService.throwNotFoundException(id);
          }

          return await tm.findOne(UserEntity, id, {select: SELECT_OPTIONS});
        }),
      );
    } catch (exception) {
      this.checkException(exception, nickName, email);
    }
  }

  async updateRoles(
    id: string,
    {isUser, isAdmin}: UpdateUserRolesDto,
  ): Promise<UserRolesResponseDto> {
    const roles: UserRole[] = [];

    if (isUser) {
      roles.push(UserRole.USER);
    }

    if (isAdmin) {
      roles.push(UserRole.ADMIN);
    }
    try {
      await this.userRepository.manager.transaction(async (tm) => {
        const result = await tm.update(UserEntity, {id}, {roles});

        if (!result.affected) {
          UserService.throwNotFoundException(id);
        }
      });

      return toUserRolesResponseDto(id, roles);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async updatePassword(
    id: string,
    {oldPassword, password}: UpdateUserPasswordDto,
    userPayload: UserPayload,
  ): Promise<void> {
    UserService.checkUserRole(id, userPayload);

    if (!userPayload.isAdmin && typeof oldPassword === 'undefined') {
      throw new BadRequestException(
        'oldPassword field is required for non-admins',
      );
    }

    try {
      await this.userRepository.manager.transaction(async (tm) => {
        const user = await tm.findOne(UserEntity, id, {
          select: ['encryptedPassword'],
        });

        if (!user) {
          UserService.throwNotFoundException(id);
        }

        if (
          !userPayload.isAdmin &&
          !(await checkPassword(oldPassword, user.encryptedPassword))
        ) {
          throw new ConflictException('Invalid old password');
        }

        const encryptedPassword = await encryptPassword(password);

        await tm.update(UserEntity, {id}, {encryptedPassword});
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.userRepository.manager.transaction(async (tm) => {
        const result = await tm.delete(UserEntity, {id});

        if (!result.affected) {
          UserService.throwNotFoundException(id);
        }
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async findOne(
    id: string,
    userPayload: UserPayload,
  ): Promise<UserResponseDto> {
    UserService.checkUserRole(id, userPayload);

    try {
      const user = await this.userRepository.findOne(id, {
        select: SELECT_OPTIONS,
      });

      if (!user) {
        UserService.throwNotFoundException(id);
      }

      return toUserResponseDto(user);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async find({
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort,
    filter,
    filterFields,
    isUser,
    isAdmin,
  }: FindUsersDto): Promise<UserPageResponseDto> {
    let queryBuilder = this.userRepository.createQueryBuilder().take(size);

    queryBuilder = configSelect(queryBuilder, SELECT_OPTIONS);

    if (page !== MIN_PAGE) {
      queryBuilder = queryBuilder.skip(findSkip(page, size));
    }

    if (typeof isUser !== 'undefined') {
      queryBuilder = UserService.configRoleCheck(
        queryBuilder,
        UserRole.USER,
        isUser,
      );
    }

    if (typeof isAdmin !== 'undefined') {
      queryBuilder = UserService.configRoleCheck(
        queryBuilder,
        UserRole.ADMIN,
        isAdmin,
      );
    }

    if (filter) {
      queryBuilder = configFilter(
        queryBuilder,
        filter,
        filterFields || DEFAULT_FILTER_FIELDS,
      );
    }

    if (sort) {
      queryBuilder = configSort(queryBuilder, sort);
    }

    try {
      const [users, total] = await queryBuilder.getManyAndCount();

      return toUserPageResponseDto(users, page, size, total);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  private checkException(exception: any, nickName = '', email = '') {
    if (
      exception instanceof NotFoundException ||
      exception instanceof ConflictException
    ) {
      throw exception;
    } else if (
      exception.code === UNIQUE_VIOLATION ||
      exception.code === CHECK_VIOLATION
    ) {
      this.logger.debug('Exception: ' + JSON.stringify(exception));

      if (exception.constraint === 'user_nick_name_key') {
        throw new ConflictException(`Nickname "${nickName}" already exists`);
      } else if (exception.constraint === 'user_email_lower_idx') {
        throw new ConflictException(`Email "${email}" already exists`);
      } else if (exception.constraint === 'user_nick_name_check') {
        throw new BadRequestException(
          `Nickname has an invalid "${nickName}" value`,
        );
      } else if (exception.constraint === 'user_email_check') {
        throw new BadRequestException(`Email has an invalid "${email}" value`);
      }
    }

    this.logger.error(
      `Unknown database error: ${exception.message ?? 'Something went wrong.'}`,
    );

    throw new InternalServerErrorException();
  }

  private static throwNotFoundException(id: string) {
    throw new NotFoundException(`User with id "${id}" not exists`);
  }

  private static configRoleCheck(
    queryBuilder: SelectQueryBuilder<UserEntity>,
    role: UserRole,
    exists: boolean,
  ): SelectQueryBuilder<UserEntity> {
    return queryBuilder.andWhere(
      exists
        ? `:${role} = ANY (${queryBuilder.alias}.roles)`
        : `:${role} <> ALL (${queryBuilder.alias}.roles)`,
      {[role]: role},
    );
  }

  private static checkUserRole(
    id: string,
    {id: userId, isUser, isAdmin}: UserPayload,
  ): void {
    if (!isAdmin && (!isUser || id !== userId)) {
      throw new ForbiddenException();
    }
  }
}
