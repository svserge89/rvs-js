import {
  PageResponseDto,
  toPageResponseDto,
} from '../../../dto/page-response.dto';
import {MenuEntryEntity} from '../entity/menu-entry.entity';
import {
  MenuEntryResponseDto,
  toMenuEntryResponseDto,
} from './menu-entry-response.dto';

export type MenuEntryPageResponseDto = PageResponseDto<MenuEntryResponseDto>;

export const toMenuEntryPageResponseDto = (
  content: MenuEntryEntity[],
  page: number,
  size: number,
  total: number,
) => toPageResponseDto(toMenuEntryResponseDto, content, page, size, total);
