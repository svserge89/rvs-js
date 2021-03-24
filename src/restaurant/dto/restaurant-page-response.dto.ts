import {PageResponseDto, toPageResponseDto} from '../../dto/page-response.dto';
import {
  RestaurantResponseDto,
  toRestaurantResponseDto,
} from './restaurant-response.dto';

export type RestaurantPageResponseDto = PageResponseDto<RestaurantResponseDto>;

export const toRestaurantPageResponseDto = toPageResponseDto.bind(
  null,
  toRestaurantResponseDto,
);
