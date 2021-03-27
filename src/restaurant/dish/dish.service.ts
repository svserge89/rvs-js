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
import {RestaurantEntity} from '../entity/restaurant.entity';
import {RestaurantNotFoundException} from '../exception/restaurant-not-found.exception';
import {CreateDishDto} from './dto/create-dish.dto';
import {
  DishPageResponseDto,
  toDishPageResponseDto,
} from './dto/dish-page-response.dto';
import {DishResponseDto, toDishResponseDto} from './dto/dish-response.dto';
import {FindDishesDto} from './dto/find-dishes.dto';
import {UpdateDishDto} from './dto/update-dish.dto';
import {DishEntity} from './entity/dish.entity';
import {DishConflictNameException} from './exception/dish-conflict-name.exception';
import {DishInvalidNameException} from './exception/dish-invalid-name.exception';
import {DishNotFoundException} from './exception/dish-not-found.exception';

const DEFAULT_FILTER_FIELDS: (keyof DishEntity)[] = ['name', 'description'];

@Injectable()
export class DishService {
  private readonly logger = new Logger('DishService');

  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  async create(
    restaurantId: string,
    {name, description, date}: CreateDishDto,
  ): Promise<DishResponseDto> {
    try {
      return toDishResponseDto(
        await this.dishRepository.manager.transaction(async (tm) => {
          const restaurant = await tm.findOne(RestaurantEntity, restaurantId, {
            select: ['id'],
          });

          if (!restaurant) {
            throw new RestaurantNotFoundException(restaurantId);
          }

          const dish = this.dishRepository.create({
            name,
            description,
            date,
            restaurant,
          });

          return await tm.save(dish);
        }),
      );
    } catch (exception) {
      this.checkException(exception, name);
    }
  }

  async update(
    restaurantId: string,
    id: string,
    {name, description, date}: UpdateDishDto,
  ): Promise<DishResponseDto> {
    if (!name && !description && !date) {
      throw new AllFieldsIsEmptyException();
    }

    try {
      return toDishResponseDto(
        await this.dishRepository.manager.transaction(async (tm) => {
          const updateFields: Partial<DishEntity> = {};

          if (name) {
            updateFields.name = name;
          }

          if (description) {
            updateFields.description = description;
          }

          if (date) {
            updateFields.date = date;
          }

          const result = await tm.update(
            DishEntity,
            {id, restaurant: {id: restaurantId}},
            updateFields,
          );

          if (!result.affected) {
            throw new DishNotFoundException(id);
          }

          return await tm.findOne(DishEntity, {
            id,
            restaurant: {id: restaurantId},
          });
        }),
      );
    } catch (exception) {
      this.checkException(exception, name);
    }
  }

  async delete(restaurantId: string, id: string): Promise<void> {
    try {
      return await this.dishRepository.manager.transaction(async (tm) => {
        const result = await tm.delete(DishEntity, {
          id,
          restaurant: {id: restaurantId},
        });

        if (!result.affected) {
          throw new DishNotFoundException(id);
        }
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async findOne(restaurantId: string, id: string): Promise<DishResponseDto> {
    try {
      const dish = await this.dishRepository.findOne({
        id,
        restaurant: {id: restaurantId},
      });

      if (!dish) {
        throw new DishNotFoundException(id);
      }

      return toDishResponseDto(dish);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async find(
    restaurantId: string,
    {
      page,
      size,
      sort,
      filter,
      filterFields,
      date,
      minDate,
      maxDate,
    }: FindDishesDto,
  ): Promise<DishPageResponseDto> {
    const queryBuilder = createFindQueryBuilder(this.dishRepository, {
      page,
      size,
      sort,
      filter,
      filterFields: filterFields || DEFAULT_FILTER_FIELDS,
      date,
      minDate,
      maxDate,
    });

    try {
      const [dishes, total] = await queryBuilder.getManyAndCount();

      return toDishPageResponseDto(dishes, page, size, total);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  private checkException(exception: any, name?: string) {
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

      if (exception.constraint === 'dish_name_date_restaurant_id_key') {
        throw new DishConflictNameException(name);
      } else if (exception.constraint === 'dish_name_check') {
        throw new DishInvalidNameException(name);
      }
    }

    throw new UnknownException(this.logger, exception);
  }
}
