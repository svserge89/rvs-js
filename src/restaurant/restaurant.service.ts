import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {CHECK_VIOLATION, UNIQUE_VIOLATION} from '../utils/database';
import {configFilter} from '../utils/filter';
import {
  DEFAULT_PAGE,
  DEFAULT_SIZE,
  findSkip,
  MIN_PAGE,
} from '../utils/pagination';
import {configSort} from '../utils/sort';
import {CreateRestaurantDto} from './dto/create-restaurant.dto';
import {FindRestaurantsDto} from './dto/find-restaurants.dto';
import {
  RestaurantPageResponseDto,
  toRestaurantPageResponseDto,
} from './dto/restaurant-page-response.dto';
import {
  RestaurantResponseDto,
  toRestaurantResponseDto,
} from './dto/restaurant-response.dto';
import {UpdateRestaurantDto} from './dto/update-restaurant.dto';
import {RestaurantEntity} from './entity/restaurant.entity';

const DEFAULT_FILTER_FIELDS: (keyof RestaurantEntity)[] = [
  'name',
  'description',
];

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger('RestaurantService');

  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async create({
    name,
    description,
  }: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    const restaurant = this.restaurantRepository.create({name, description});

    try {
      return toRestaurantResponseDto(
        await this.restaurantRepository.save(restaurant),
      );
    } catch (exception) {
      this.checkException(exception, name);
    }
  }

  async update(
    id: string,
    {name, description}: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    if (!name && !description) {
      throw new BadRequestException('All fields is empty');
    }

    try {
      return toRestaurantResponseDto(
        await this.restaurantRepository.manager.transaction(async (tm) => {
          const updateFields: Partial<RestaurantEntity> = {};

          if (name) {
            updateFields.name = name;
          }

          if (description) {
            updateFields.description = description;
          }

          const result = await tm.update(RestaurantEntity, {id}, updateFields);

          if (!result.affected) {
            RestaurantService.throwNotFoundException(id);
          }

          return await tm.findOne(RestaurantEntity, id);
        }),
      );
    } catch (exception) {
      this.checkException(exception, name);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.restaurantRepository.manager.transaction(async (tm) => {
        const result = await tm.delete(RestaurantEntity, id);

        if (!result.affected) {
          RestaurantService.throwNotFoundException(id);
        }
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async findOne(id: string): Promise<RestaurantResponseDto> {
    try {
      const restaurant = await this.restaurantRepository.findOne(id);

      if (!restaurant) {
        RestaurantService.throwNotFoundException(id);
      }

      return toRestaurantResponseDto(restaurant);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async find({
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    sort,
    filter,
    filterFields,
  }: FindRestaurantsDto): Promise<RestaurantPageResponseDto> {
    let queryBuilder = this.restaurantRepository
      .createQueryBuilder()
      .take(size);

    if (page !== MIN_PAGE) {
      queryBuilder = queryBuilder.skip(findSkip(page, size));
    }

    if (filter) {
      queryBuilder = configFilter(
        queryBuilder,
        filter,
        filterFields || DEFAULT_FILTER_FIELDS,
      );
    }

    if (sort) {
      queryBuilder = configSort(queryBuilder, sort);
    }

    try {
      const [restaurants, total] = await queryBuilder.getManyAndCount();

      return toRestaurantPageResponseDto(restaurants, page, size, total);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  private checkException(exception: any, name = '') {
    if (
      exception instanceof NotFoundException ||
      exception instanceof ConflictException
    ) {
      throw exception;
    } else if (
      exception.code === UNIQUE_VIOLATION ||
      exception.code === CHECK_VIOLATION
    ) {
      this.logger.debug('Exception: ' + JSON.stringify(exception));

      if (exception.constraint === 'restaurant_name_key') {
        throw new ConflictException(
          `Restaurant with name "${name}" already exists`,
        );
      } else if (exception.constraint === 'restaurant_name_check') {
        throw new BadRequestException(
          `Restaurant name has an invalid "${name}" value`,
        );
      }
    }

    this.logger.error(
      `Unknown database error: ${exception.message ?? 'Something went wrong.'}`,
    );

    throw new InternalServerErrorException();
  }

  private static throwNotFoundException(id: string) {
    throw new NotFoundException(`Restaurant with id "${id}" not exists`);
  }
}
