import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../auth/auth.module';
import {DishModule} from './dish/dish.module';
import {RestaurantEntity} from './entity/restaurant.entity';
import {RestaurantController} from './restaurant.controller';
import {RestaurantService} from './restaurant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    AuthModule,
    DishModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
