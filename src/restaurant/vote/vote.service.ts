import {LocalDate, LocalTime} from '@js-joda/core';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {UnknownException} from '../../exception/unknown.exception';
import {createFindQueryBuilder, UNIQUE_VIOLATION} from '../../utils/database';
import {checkVoteTime, configDateFilter} from '../../utils/datetime';
import {DESC_VALUE} from '../../utils/sort';
import {RestaurantEntity} from '../entity/restaurant.entity';
import {RestaurantNotFoundException} from '../exception/restaurant-not-found.exception';
import {FindRatingDto} from './dto/find-rating.dto';
import {FindVoteEntriesByUserDto} from './dto/find-vote-entries-by-user.dto';
import {
  toVoteEntryPageResponseDto,
  VoteEntryPageResponseDto,
} from './dto/vote-entry-page-response.dto';
import {VoteEntryEntity} from './entity/vote-entry.entity';
import {VoteEntryChangeRestrictedException} from './exception/vote-entry-change-restricted.exception';
import {VoteEntryConflictUserException} from './exception/vote-entry-conflict-user.exception';
import {VoteEntryNotFoundException} from './exception/vote-entry-not-found.exception';

const DEFAULT_SORT_FIELDS: (
  | keyof (VoteEntryEntity & RestaurantEntity)
  | typeof DESC_VALUE
)[] = ['date', DESC_VALUE, 'time', DESC_VALUE];

@Injectable()
export class VoteService {
  private readonly logger = new Logger('VoteService');

  constructor(
    @InjectRepository(VoteEntryEntity)
    private readonly voteEntryRepository: Repository<VoteEntryEntity>,
  ) {}

  async create(userId: string, restaurantId: string): Promise<void> {
    try {
      return await this.voteEntryRepository.manager.transaction(async (tm) => {
        const restaurant = await tm.findOne(RestaurantEntity, restaurantId, {
          select: ['id'],
        });

        if (!restaurant) {
          throw new RestaurantNotFoundException(restaurantId);
        }

        const vote = await tm.findOne(
          VoteEntryEntity,
          {
            user: {id: userId},
            date: LocalDate.now(),
          },
          {select: ['id']},
        );

        if (vote) {
          if (!checkVoteTime()) {
            throw new VoteEntryChangeRestrictedException();
          }

          await tm.update(
            VoteEntryEntity,
            {id: vote.id},
            {restaurant, time: LocalTime.now()},
          );
        } else {
          await tm.insert(VoteEntryEntity, {user: {id: userId}, restaurant});
        }
      });
    } catch (exception) {
      this.checkException(exception, userId);
    }
  }

  async delete(userId: string, restaurantId: string): Promise<void> {
    if (!checkVoteTime()) {
      throw new VoteEntryChangeRestrictedException();
    }

    try {
      return await this.voteEntryRepository.manager.transaction(async (tm) => {
        const result = await tm.delete(VoteEntryEntity, {
          user: {id: userId},
          restaurant: {id: restaurantId},
        });

        if (!result.affected) {
          throw new VoteEntryNotFoundException(restaurantId);
        }
      });
    } catch (exception) {
      this.checkException(exception, userId);
    }
  }

  async rating(
    restaurantId: string,
    {date, minDate, maxDate}: FindRatingDto,
  ): Promise<number> {
    let queryBuilder = this.voteEntryRepository.createQueryBuilder();

    queryBuilder = queryBuilder.where(
      `${queryBuilder.alias}.restaurant.id = :restaurantId`,
      {
        restaurantId,
      },
    );

    queryBuilder = configDateFilter(queryBuilder, {date, minDate, maxDate});

    try {
      return await queryBuilder.getCount();
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async findByUser(
    userId: string,
    {
      page,
      size,
      filter,
      sort = DEFAULT_SORT_FIELDS,
      date,
      minDate,
      maxDate,
    }: FindVoteEntriesByUserDto,
  ): Promise<VoteEntryPageResponseDto> {
    const fieldsMap = new Map<string, string>([['name', 'restaurant.name']]);

    const queryBuilder = createFindQueryBuilder(this.voteEntryRepository, {
      page,
      size,
      filter,
      filterFields: ['name'],
      sort,
      date,
      minDate,
      maxDate,
      fieldsMap,
      relation: 'restaurant',
    });

    queryBuilder.andWhere(`${queryBuilder.alias}.user.id = :userId`, {userId});

    try {
      const [voteEntries, total] = await queryBuilder.getManyAndCount();

      return toVoteEntryPageResponseDto(voteEntries, page, size, total);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  private checkException(exception: any, userId?: string) {
    if (
      exception instanceof NotFoundException ||
      exception instanceof ConflictException
    ) {
      throw exception;
    } else if (exception.code === UNIQUE_VIOLATION) {
      this.logger.debug('Exception: ' + JSON.stringify(exception));

      if (exception.constraint === 'vote_entry_user_id_date_key') {
        throw new VoteEntryConflictUserException(userId);
      }
    }

    throw new UnknownException(this.logger, exception);
  }
}
