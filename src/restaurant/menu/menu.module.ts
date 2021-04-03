import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {AuthModule} from '../../auth/auth.module';
import {MenuEntryEntity} from './entity/menu-entry.entity';
import {MenuController} from './menu.controller';
import {MenuService} from './menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntryEntity]), AuthModule],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
