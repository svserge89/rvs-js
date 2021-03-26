import {DateTimeFormatter} from '@js-joda/core';

import {DishEntity} from '../entity/dish.entity';

export interface DishResponseDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  date: string;
}

export function toDishResponseDto({
  id,
  name,
  description,
  imageUrl,
  date,
}: DishEntity): DishResponseDto {
  return {
    id,
    name,
    description,
    imageUrl,
    date: date.format(DateTimeFormatter.ISO_LOCAL_DATE),
  };
}
