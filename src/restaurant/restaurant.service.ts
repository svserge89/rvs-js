import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {AllFieldsIsEmptyException} from '../exception/all-fields-is-empty.exception';
import {UnknownException} from '../exception/unknown.exception';
import {ImageService} from '../image/image.service';
import {Dimension} from '../image/types/dimension.interface';
import {
  CHECK_VIOLATION,
  createFindQueryBuilder,
  UNIQUE_VIOLATION,
} from '../utils/database';
import {DESC_VALUE} from '../utils/sort';
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
import {RestaurantConflictNameException} from './exception/restaurant-conflict-name.exception';
import {RestaurantInvalidNameException} from './exception/restaurant-invalid-name.exception';
import {RestaurantNotFoundException} from './exception/restaurant-not-found.exception';
import {VoteEntryEntity} from './vote/entity/vote-entry.entity';

const DEFAULT_FILTER_FIELDS: (keyof RestaurantEntity)[] = [
  'name',
  'description',
];
const DEFAULT_SORT_FIELDS: (keyof RestaurantEntity | typeof DESC_VALUE)[] = [
  'name',
];
const IMAGE_SIZE: Dimension = {width: 250, height: 250};
const IMAGE_PATH = 'restaurant';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger('RestaurantService');

  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    private readonly imageService: ImageService,
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
      throw new AllFieldsIsEmptyException();
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
            throw new RestaurantNotFoundException(id);
          }

          return await tm.findOne(RestaurantEntity, id);
        }),
      );
    } catch (exception) {
      this.checkException(exception, name);
    }
  }

  async updateImage(id: string, image: Express.Multer.File) {
    try {
      const fileName = await this.imageService.save(
        image,
        IMAGE_SIZE,
        IMAGE_PATH,
      );

      await this.restaurantRepository.manager.transaction(async (tm) => {
        const restaurant = await tm.findOne(RestaurantEntity, id);

        if (!restaurant) {
          throw new RestaurantNotFoundException(id);
        }

        if (restaurant.imageUrl) {
          await this.imageService.delete(restaurant.imageUrl);
        }

        restaurant.imageUrl = fileName;

        await tm.save(restaurant);
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async removeImage(id: string) {
    try {
      await this.restaurantRepository.manager.transaction(async (tm) => {
        const restaurant = await tm.findOne(RestaurantEntity, id);

        if (!restaurant) {
          throw new RestaurantNotFoundException(id);
        }

        if (restaurant.imageUrl) {
          await this.imageService.delete(restaurant.imageUrl);
        }

        restaurant.imageUrl = null;

        await tm.save(restaurant);
      });
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.restaurantRepository.manager.transaction(async (tm) => {
        const result = await tm.delete(RestaurantEntity, id);

        if (!result.affected) {
          throw new RestaurantNotFoundException(id);
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
        throw new RestaurantNotFoundException(id);
      }

      return toRestaurantResponseDto(restaurant);
    } catch (exception) {
      this.checkException(exception);
    }
  }

  async find({
    page,
    size,
    filter,
    filterFields = DEFAULT_FILTER_FIELDS,
    sort = DEFAULT_SORT_FIELDS,
    ratingDate,
    ratingMinDate,
    ratingMaxDate,
  }: FindRestaurantsDto): Promise<RestaurantPageResponseDto> {
    const queryBuilder = createFindQueryBuilder(this.restaurantRepository, {
      page,
      size,
      sort,
      filter,
      filterFields,
      count: {
        relation: 'votes',
        parent: 'restaurant',
        field: 'rating',
        entity: VoteEntryEntity,
        date: ratingDate,
        minDate: ratingMinDate,
        maxDate: ratingMaxDate,
      },
    });

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
        throw new RestaurantConflictNameException(name);
      } else if (exception.constraint === 'restaurant_name_check') {
        throw new RestaurantInvalidNameException(name);
      }
    }

    throw new UnknownException(this.logger, exception);
  }
}
