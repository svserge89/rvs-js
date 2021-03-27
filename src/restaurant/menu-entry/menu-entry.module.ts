import {Module} from '@nestjs/common';

import {MenuEntryController} from './menu-entry.controller';
import {MenuEntryService} from './menu-entry.service';

@Module({
  providers: [MenuEntryService],
  controllers: [MenuEntryController],
})
export class MenuEntryModule {}
