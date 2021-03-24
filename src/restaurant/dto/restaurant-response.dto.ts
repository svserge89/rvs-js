import {RestaurantEntity} from '../entity/restaurant.entity';

export interface RestaurantResponseDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export function toRestaurantResponseDto({
  id,
  name,
  description,
  imageUrl,
}: RestaurantEntity) {
  return {id, name, description, imageUrl};
}
