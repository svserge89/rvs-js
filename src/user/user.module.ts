import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../auth/auth.module';
import {VoteModule} from '../restaurant/vote/vote.module';
import {UserEntity} from './entity/user.entity';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule, VoteModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
