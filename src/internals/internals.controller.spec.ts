import { Test, TestingModule } from '@nestjs/testing';
import { InternalsController } from './internals.controller';
import { InternalsService } from './internals.service';

describe('InternalsController', () => {
  let controller: InternalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalsController],
      providers: [InternalsService],
    }).compile();

    controller = module.get<InternalsController>(InternalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
