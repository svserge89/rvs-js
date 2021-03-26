import {
  PageResponseDto,
  toPageResponseDto,
} from '../../../dto/page-response.dto';
import {DishEntity} from '../entity/dish.entity';
import {DishResponseDto, toDishResponseDto} from './dish-response.dto';

export type DishPageResponseDto = PageResponseDto<DishResponseDto>;

export const toDishPageResponseDto = (
  content: DishEntity[],
  page: number,
  size: number,
  total: number,
) => toPageResponseDto(toDishResponseDto, content, page, size, total);
