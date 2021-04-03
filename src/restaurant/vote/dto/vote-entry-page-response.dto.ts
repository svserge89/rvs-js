import {
  PageResponseDto,
  toPageResponseDto,
} from '../../../dto/page-response.dto';
import {VoteEntryEntity} from '../entity/vote-entry.entity';
import {
  toVoteEntryResponseDto,
  VoteEntryResponseDto,
} from './vote-entry-response.dto';

export type VoteEntryPageResponseDto = PageResponseDto<VoteEntryResponseDto>;

export const toVoteEntryPageResponseDto = (
  content: VoteEntryEntity[],
  page: number,
  size: number,
  total: number,
) => toPageResponseDto(toVoteEntryResponseDto, content, page, size, total);
