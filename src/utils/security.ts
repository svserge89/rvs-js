import {compare, genSalt, hash} from 'bcrypt';

export const NICK_NAME_MIN_LENGTH = 3;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 42;
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\/:;<=>?\\@[\]^_`{|}~])/;

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
