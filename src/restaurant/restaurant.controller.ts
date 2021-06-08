import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {FileInterceptor} from '@nestjs/platform-express';

import {RoleAdmin} from '../auth/decorators/role-admin.decorator';
import {RolesGuard} from '../auth/guards/roles.guard';
import {ImageValidationPipe} from '../image/pipe/image-validation.pipe';
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

  @Put(':id/image')
  @UseGuards(AuthGuard(), RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @RoleAdmin()
  uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ) {
    return this.restaurantService.updateImage(id, image);
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

  @Delete(':id/image')
  @UseGuards(AuthGuard(), RolesGuard)
  @RoleAdmin()
  removeImage(@Param('id') id: string) {
    return this.restaurantService.removeImage(id);
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
