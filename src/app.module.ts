import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from './auth/auth.module';
import {typeOrmConfig} from './config/typeorm.config';
import {RestaurantModule} from './restaurant/restaurant.module';
import {UserModule} from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    RestaurantModule,
  ],
  providers: [],
})
export class AppModule {}
