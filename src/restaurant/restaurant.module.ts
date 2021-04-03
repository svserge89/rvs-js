import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../auth/auth.module';
import {DishModule} from './dish/dish.module';
import {RestaurantEntity} from './entity/restaurant.entity';
import {MenuModule} from './menu/menu.module';
import {RestaurantController} from './restaurant.controller';
import {RestaurantService} from './restaurant.service';
import {VoteModule} from './vote/vote.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    AuthModule,
    DishModule,
    MenuModule,
    VoteModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
