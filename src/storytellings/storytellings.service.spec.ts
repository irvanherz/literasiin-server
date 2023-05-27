import { Test, TestingModule } from '@nestjs/testing';
import { StorytellingsService } from './storytellings.service';

describe('StorytellingsService', () => {
  let service: StorytellingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorytellingsService],
    }).compile();

    service = module.get<StorytellingsService>(StorytellingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
