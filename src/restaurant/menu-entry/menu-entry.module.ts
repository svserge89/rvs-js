import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth/auth.module';
import {MenuEntryEntity} from './entity/menu-entry.entity';
import {MenuEntryController} from './menu-entry.controller';
import {MenuEntryService} from './menu-entry.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntryEntity]), AuthModule],
  providers: [MenuEntryService],
  controllers: [MenuEntryController],
})
export class MenuEntryModule {}
