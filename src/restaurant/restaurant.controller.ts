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
import {FindRestaurantsDto} from './dto/find-restaurants.dto';
import {RestaurantPageResponseDto} from './dto/restaurant-page-response.dto';
import {RestaurantResponseDto} from './dto/restaurant-response.dto';
import {UpdateRestaurantDto} from './dto/update-restaurant.dto';
import {RestaurantService} from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

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
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RestaurantResponseDto> {
    return this.restaurantService.findOne(id);
  }

  @Get()
  find(
    @Query(new ValidationPipe({transform: true}))
    restaurantsDto: FindRestaurantsDto,
  ): Promise<RestaurantPageResponseDto> {
    return this.restaurantService.find(restaurantsDto);
  }
}
