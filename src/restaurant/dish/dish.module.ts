import {Module} from '@nestjs/common';

import {DishController} from './dish.controller';
import {DishService} from './dish.service';

@Module({
  providers: [DishService],
  controllers: [DishController],
})
export class DishModule {}
