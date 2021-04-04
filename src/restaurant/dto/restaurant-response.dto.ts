import {RestaurantEntity} from '../entity/restaurant.entity';

export interface RestaurantResponseDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export function toRestaurantResponseDto({
  id,
  name,
  description,
  imageUrl,
  rating,
}: RestaurantEntity) {
  return {id, name, description, imageUrl, rating};
}
