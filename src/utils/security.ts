import {compare, genSalt, hash} from 'bcrypt';
import {get as getConfig} from 'config';

import {SecurityConfig} from '../config/types/security-config.interface';

const {jwtSecret, jwtExpiresIn} = getConfig<SecurityConfig>('security');

export const NICK_NAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 42;
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\/:;<=>?\\@[\]^_`{|}~])/;

export const JWT_SECRET = process.env.JWT_SECRET ?? jwtSecret;
export const JWT_EXPIRES_IN =
  Number.parseInt(process.env.JWT_EXPIRES_IN) || jwtExpiresIn;

export async function encryptPassword(password: string): Promise<string> {
  const salt = await genSalt();

  return hash(password, salt);
}

export function checkPassword(
  password: string,
  encryptedPassword: string,
): Promise<boolean> {
  return compare(password, encryptedPassword);
}
