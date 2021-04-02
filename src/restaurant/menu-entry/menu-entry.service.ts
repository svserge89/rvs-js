import {LocalDate} from '@js-joda/core';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {AllFieldsIsEmptyException} from '../../exception/all-fields-is-empty.exception';
import {UnknownException} from '../../exception/unknown.exception';
import {
  CHECK_VIOLATION,
  createFindQueryBuilder,
  UNIQUE_VIOLATION,
} from '../../utils/database';
import {DESC_VALUE} from '../../utils/sort';
import {DishEntity} from '../dish/entity/dish.entity';
import {DishNotFoundException} from '../dish/exception/dish-not-found.exception';
import {RestaurantEntity} from '../entity/restaurant.entity';
import {RestaurantNotFoundException} from '../exception/restaurant-not-found.exception';
import {CreateMenuEntryDto} from './dto/create-menu-entry.dto';
import {FindMenuEntriesDto} from './dto/find-menu-entries.dto';
import {
  MenuEntryPageResponseDto,
  toMenuEntryPageResponseDto,
} from './dto/menu-entry-page-response.dto';
import {
  MenuEntryResponseDto,
  toMenuEntryResponseDto,
} from './dto/menu-entry-response.dto';
import {UpdateMenuEntryDto} from './dto/update-menu-entry.dto';
import {MenuEntryEntity} from './entity/menu-entry.entity';
import {MenuEntryConflictDishException} from './exception/menu-entry-conflict-dish.exception';
import {MenuEntryInvalidPriceException} from './exception/menu-entry-invalid-price.exception';
import {MenuEntryNotFoundException} from './exception/menu-entry-not-found.exception';

const DEFAULT_FILTER_FIELDS: (keyof (MenuEntryEntity & DishEntity))[] = [
  'name',
  'description',
];
const DEFAULT_SORT_FIELDS: (
  | keyof (MenuEntryEntity & DishEntity)
  | typeof DESC_VALUE
)[] = ['price', 'name'];

@Injectable()
export class MenuEntryService {
  private readonly logger = new Logger('MenuEntryService');

  constructor(
    @InjectRepository(MenuEntryEntity)
    private readonly menuEntryRepository: Repository<MenuEntryEntity>,
  ) {}

  async create(
    restaurantId: string,
    {dishId, price, date}: CreateMenuEntryDto,
  ): Promise<MenuEntryResponseDto> {
    try {
      return toMenuEntryResponseDto(
        await this.menuEntryRepository.manager.transaction(async (tm) => {
          const restaurant = await tm.findOne(RestaurantEntity, restaurantId, {
            select: ['id'],
          });

          if (!restaurant) {
            throw new RestaurantNotFoundException(restaurantId);
          }

          const dish = await tm.findOne(
            DishEntity,
            {id: dishId, restaurant: {id: restaurantId}},
            {select: ['id', 'name', 'description', 'imageUrl']},
          );

          if (!dish) {
            throw new DishNotFoundException(dishId);
          }

          const menuEntry = this.menuEntryRepository.create({
            price,
            date,
            dish,
            restaurant,
          });

          return await tm.save(menuEntry);
        }),
      );
    } catch (exception) {
      this.checkException(exception, dishId, price);
    }
  }

  async update(
    restaurantId: string,
    id: string,
    {dishId, price, date}: UpdateMenuEntryDto,
  ): Promise<MenuEntryResponseDto> {
    if (!dishId && !price && !date) {
      throw new AllFieldsIsEmptyException();
    }

    try {
      return toMenuEntryResponseDto(
        await this.menuEntryRepository.manager.transaction(async (tm) => {
          let dish: DishEntity;

          if (dishId) {
            dish = await tm.findOne(
              DishEntity,
              {id: dishId, restaurant: {id: restaurantId}},
              {select: ['id']},
            );

            if (!dish) {
              throw new DishNotFoundException(dishId);
            }
          }

          const updateFields: Partial<MenuEntryEntity> = {};

          if (dish) {
            updateFields.dish = dish;
          }

          if (price) {
            updateFields.price = price;
          }

          if (date) {
            updateFields.date = date;
          }

          const result = await tm.update(
            MenuEntryEntity,
            {id, restaurant: {id: restaurantId}},
            updateFields,
          );

          if (!result.affected) {
            throw new MenuEntryNotFoundException(id);
          }

          return await tm.findOne(MenuEntryEntity, {
            id,
            restaurant: {id: restaurantId},
          });
        }),
      );
    } catch (exception) {
      this.checkException(exception, dishId, price);
    }
  }

  async delete(restaurantId: string, id: string): Promise<void> {
    try {
      return await this.menuEntryRepository.manager.transaction(async (tm) => {
        const result = await tm.delete(MenuEntryEntity, {
          id,
          restaurant: {id: restaurantId},
        });

        if (!result.affected) {
          throw new MenuEntryNotFoundException(id);
        }
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async findOne(
    restaurantId: string,
    id: string,
  ): Promise<MenuEntryResponseDto> {
    try {
      const menuEntry = await this.menuEntryRepository.findOne({
        id,
        restaurant: {id: restaurantId},
      });

      if (!menuEntry) {
        throw new MenuEntryNotFoundException(id);
      }

      return toMenuEntryResponseDto(menuEntry);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async find(
    restaurantId: string,
    {
      page,
      size,
      filter,
      filterFields = DEFAULT_FILTER_FIELDS,
      sort = DEFAULT_SORT_FIELDS,
      date = LocalDate.now(),
      minDate,
      maxDate,
    }: FindMenuEntriesDto,
  ): Promise<MenuEntryPageResponseDto> {
    const fieldsMap = new Map<string, string>([
      ['name', 'dish.name'],
      ['description', 'dish.description'],
    ]);

    const queryBuilder = createFindQueryBuilder(this.menuEntryRepository, {
      page,
      size,
      filter,
      filterFields,
      sort,
      date,
      minDate,
      maxDate,
      fieldsMap,
      relation: 'dish',
    });

    queryBuilder.andWhere(
      `${queryBuilder.alias}.restaurant.id = :restaurantId`,
      {restaurantId},
    );

    try {
      const [menuEntries, total] = await queryBuilder.getManyAndCount();

      return toMenuEntryPageResponseDto(menuEntries, page, size, total);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  private checkException(exception: any, id?: string, price?: string) {
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

      if (
        exception.constraint === 'menu_entry_date_dish_id_restaurant_id_key'
      ) {
        throw new MenuEntryConflictDishException(id);
      } else if (exception.constraint === 'menu_entry_price_check') {
        throw new MenuEntryInvalidPriceException(price);
      }
    }

    throw new UnknownException(this.logger, exception);
  }
}
