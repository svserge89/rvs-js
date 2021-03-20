import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

import {
  EMAIL_LENGTH,
  ENCRYPTED_PASSWORD_LENGTH,
  NAME_LENGTH,
  URL_LENGTH,
} from '../../utils/database';
import {UserRole} from '../types/user-role.enum';

@Entity({name: 'user', schema: 'public'})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {name: 'id'})
  id: string;

  @Column({
    type: 'varchar',
    name: 'nick_name',
    length: NAME_LENGTH,
    unique: true,
  })
  nickName: string;

  @Column({
    type: 'varchar',
    name: 'first_name',
    length: NAME_LENGTH,
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    length: NAME_LENGTH,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    name: 'email',
    length: EMAIL_LENGTH,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'encrypted_password',
    length: ENCRYPTED_PASSWORD_LENGTH,
  })
  encryptedPassword: string;

  @Column({
    type: 'varchar',
    name: 'image_url',
    length: URL_LENGTH,
    nullable: true,
  })
  imageUrl: string;

  @Column({
    type: 'enum',
    array: true,
    enum: UserRole,
    enumName: 'public.user_role',
    default: [],
  })
  roles: UserRole[];
}
