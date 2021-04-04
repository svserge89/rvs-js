import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

import {RoleAdmin} from '../auth/decorators/role-admin.decorator';
import {RolesGuard} from '../auth/guards/roles.guard';
import {CreateRestaurantDto} from './dto/create-restaurant.dto';
import {FindRestaurantWithRatingDto} from './dto/find-restaurant-with-rating.dto';
import {FindRestaurantsDto} from './dto/find-restaurants.dto';
import {RestaurantPageResponseDto} from './dto/restaurant-page-response.dto';
import {RestaurantResponseDto} from './dto/restaurant-response.dto';
import {UpdateRestaurantDto} from './dto/update-restaurant.dto';
import {RestaurantService} from './restaurant.service';
import {FindRatingDto} from './vote/dto/find-rating.dto';
import {VoteService} from './vote/vote.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly voteService: VoteService,
  ) {}

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @RoleAdmin()
  create(
    @Body(new ValidationPipe({transform: true}))
    restaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return this.restaurantService.create(restaurantDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @RoleAdmin()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({transform: true}))
    restaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return this.restaurantService.update(id, restaurantDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @RoleAdmin()
  delete(@Param('id') id: string): Promise<void> {
    return this.restaurantService.delete(id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query(new ValidationPipe({transform: true}))
    {ratingDate, ratingMinDate, ratingMaxDate}: FindRestaurantWithRatingDto,
  ): Promise<RestaurantResponseDto> {
    const restaurant = await this.restaurantService.findOne(id);

    restaurant.rating = await this.voteService.rating(id, {
      date: ratingDate,
      minDate: ratingMinDate,
      maxDate: ratingMaxDate,
    });

    return restaurant;
  }

  @Get()
  find(
    @Query(new ValidationPipe({transform: true}))
    restaurantsDto: FindRestaurantsDto,
  ): Promise<RestaurantPageResponseDto> {
    return this.restaurantService.find(restaurantsDto);
  }

  @Get(':id/rating')
  rating(
    @Param('id', ParseUUIDPipe) id: string,
    @Query(new ValidationPipe({transform: true})) findRatingDto: FindRatingDto,
  ): Promise<number> {
    return this.voteService.rating(id, findRatingDto);
  }
}
