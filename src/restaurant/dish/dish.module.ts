import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth/auth.module';
import {DishController} from './dish.controller';
import {DishService} from './dish.service';
import {DishEntity} from './entity/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity]), AuthModule],
  providers: [DishService],
  controllers: [DishController],
})
export class DishModule {}
