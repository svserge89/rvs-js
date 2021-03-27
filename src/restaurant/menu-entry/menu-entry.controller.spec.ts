import {Test, TestingModule} from '@nestjs/testing';

import {MenuEntryController} from './menu-entry.controller';

describe('MenuEntryController', () => {
  let controller: MenuEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuEntryController],
    }).compile();

    controller = module.get<MenuEntryController>(MenuEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
