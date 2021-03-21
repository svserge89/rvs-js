import {TransformFnParams} from 'class-transformer';

export function trim({value}: TransformFnParams) {
  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
}

export function split({value}: TransformFnParams) {
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim());
  }

  return value;
}

export function toBoolean({value}: TransformFnParams) {
  if (typeof value === 'string') {
    if (value.trim().toLowerCase() === 'true') {
      return true;
    }

    if (value.trim().toLowerCase() === 'false') {
      return false;
    }
  }

  return value;
}

export function toInteger({value}: TransformFnParams) {
  const result = Number.parseInt(value);

  return Number.isNaN(result) ? value : result;
}
