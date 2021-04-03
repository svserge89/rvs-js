import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth/auth.module';
import {VoteEntryEntity} from './entity/vote-entry.entity';
import {VoteController} from './vote.controller';
import {VoteService} from './vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteEntryEntity]), AuthModule],
  providers: [VoteService],
  exports: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
