import {DateTimeFormatter} from '@js-joda/core';

import {MenuEntryEntity} from '../entity/menu-entry.entity';

export interface MenuEntryResponseDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  date: string;
  price: string;
}

export function toMenuEntryResponseDto({
  id,
  date,
  dish,
  price,
}: MenuEntryEntity): MenuEntryResponseDto {
  return {
    id,
    date: date.format(DateTimeFormatter.ISO_LOCAL_DATE),
    name: dish.name,
    description: dish.description,
    imageUrl: dish.imageUrl,
    price,
  };
}
