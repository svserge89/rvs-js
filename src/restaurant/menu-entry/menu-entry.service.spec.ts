import {Test, TestingModule} from '@nestjs/testing';
import {MenuEntryService} from './menu-entry.service';

describe('MenuEntryService', () => {
  let service: MenuEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuEntryService],
    }).compile();

    service = module.get<MenuEntryService>(MenuEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
