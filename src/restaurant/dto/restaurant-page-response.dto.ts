import {PageResponseDto, toPageResponseDto} from '../../dto/page-response.dto';
import {RestaurantEntity} from '../entity/restaurant.entity';
import {
  RestaurantResponseDto,
  toRestaurantResponseDto,
} from './restaurant-response.dto';

export type RestaurantPageResponseDto = PageResponseDto<RestaurantResponseDto>;

export const toRestaurantPageResponseDto = (
  content: RestaurantEntity[],
  page: number,
  size: number,
  total: number,
) => toPageResponseDto(toRestaurantResponseDto, content, page, size, total);
