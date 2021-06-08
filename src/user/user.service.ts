import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, SelectQueryBuilder} from 'typeorm';

import {UserPayload} from '../auth/types/user-payload.interface';
import {AllFieldsIsEmptyException} from '../exception/all-fields-is-empty.exception';
import {UnknownException} from '../exception/unknown.exception';
import {ImageService} from '../image/image.service';
import {Dimension} from '../image/types/dimension.interface';
import {
  CHECK_VIOLATION,
  configSelect,
  createFindQueryBuilder,
  UNIQUE_VIOLATION,
} from '../utils/database';
import {checkPassword, encryptPassword} from '../utils/security';
import {DESC_VALUE} from '../utils/sort';
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
import {InvalidOldPasswordException} from './exception/invalid-old-password.exception';
import {OldPasswordRequiredException} from './exception/old-password-required.exception';
import {UserConflictEmailException} from './exception/user-conflict-email.exception';
import {UserConflictNickNameException} from './exception/user-conflict-nick-name.exception';
import {UserInvalidEmailException} from './exception/user-invalid-email.exception';
import {UserInvalidNickNameException} from './exception/user-invalid-nick-name.exception';
import {UserNotFoundException} from './exception/user-not-found.exception';
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
const DEFAULT_SORT_FIELDS: (keyof UserEntity | typeof DESC_VALUE)[] = [
  'nickName',
  'email',
];
const IMAGE_SIZE: Dimension = {width: 250, height: 250};
const IMAGE_PATH = 'user';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly imageService: ImageService,
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
  ): Promise<UserResponseDto> {
    if (!nickName && !firstName && !lastName && !email) {
      throw new AllFieldsIsEmptyException();
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
            throw new UserNotFoundException(id);
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
          throw new UserNotFoundException(id);
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
    if (!userPayload.isAdmin && typeof oldPassword === 'undefined') {
      throw new OldPasswordRequiredException();
    }

    try {
      await this.userRepository.manager.transaction(async (tm) => {
        const user = await tm.findOne(UserEntity, id, {
          select: ['encryptedPassword'],
        });

        if (!user) {
          throw new UserNotFoundException(id);
        }

        if (
          !userPayload.isAdmin &&
          !(await checkPassword(oldPassword, user.encryptedPassword))
        ) {
          throw new InvalidOldPasswordException();
        }

        const encryptedPassword = await encryptPassword(password);

        await tm.update(UserEntity, {id}, {encryptedPassword});
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  updateImage(id: string, image: Express.Multer.File): Promise<void> {
    return this.saveImage(id, image);
  }

  removeImage(id: string): Promise<void> {
    return this.saveImage(id);
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.userRepository.manager.transaction(async (tm) => {
        const result = await tm.delete(UserEntity, {id});

        if (!result.affected) {
          throw new UserNotFoundException(id);
        }
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne(id, {
        select: SELECT_OPTIONS,
      });

      if (!user) {
        throw new UserNotFoundException(id);
      }

      return toUserResponseDto(user);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async find({
    page,
    size,
    filter,
    filterFields = DEFAULT_FILTER_FIELDS,
    sort = DEFAULT_SORT_FIELDS,
    isUser,
    isAdmin,
  }: FindUsersDto): Promise<UserPageResponseDto> {
    let queryBuilder = createFindQueryBuilder(this.userRepository, {
      page,
      size,
      sort,
      filter,
      filterFields,
    });

    queryBuilder = configSelect(queryBuilder, SELECT_OPTIONS);

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

    try {
      const [users, total] = await queryBuilder.getManyAndCount();

      return toUserPageResponseDto(users, page, size, total);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  private async saveImage(id: string, image?: Express.Multer.File) {
    try {
      await this.userRepository.manager.transaction(async (tm) => {
        const user = await tm.findOne(UserEntity, id, {
          select: ['id', 'imageUrl'],
        });

        if (!user) {
          throw new UserNotFoundException(id);
        }

        const fileName = image
          ? await this.imageService.save(image, IMAGE_SIZE, IMAGE_PATH)
          : null;

        if (user.imageUrl) {
          await this.imageService.delete(user.imageUrl);
        }

        await tm.update(UserEntity, {id}, {imageUrl: fileName});
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  private checkException(exception: any, nickName?: string, email?: string) {
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
        throw new UserConflictNickNameException(nickName);
      } else if (exception.constraint === 'user_email_lower_idx') {
        throw new UserConflictEmailException(email);
      } else if (exception.constraint === 'user_nick_name_check') {
        throw new UserInvalidNickNameException(nickName);
      } else if (exception.constraint === 'user_email_check') {
        throw new UserInvalidEmailException(email);
      }
    }

    throw new UnknownException(this.logger, exception);
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
}
