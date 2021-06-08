import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth/auth.module';
import {ImageModule} from '../../image/image.module';
import {DishController} from './dish.controller';
import {DishService} from './dish.service';
import {DishEntity} from './entity/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity]), AuthModule, ImageModule],
  providers: [DishService],
  controllers: [DishController],
})
export class DishModule {}
