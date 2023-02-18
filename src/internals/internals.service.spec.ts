import { Test, TestingModule } from '@nestjs/testing';
import { InternalsService } from './internals.service';

describe('InternalsService', () => {
  let service: InternalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternalsService],
    }).compile();

    service = module.get<InternalsService>(InternalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
