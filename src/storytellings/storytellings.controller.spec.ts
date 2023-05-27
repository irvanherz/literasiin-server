import { Test, TestingModule } from '@nestjs/testing';
import { StorytellingsController } from './storytellings.controller';
import { StorytellingsService } from './storytellings.service';

describe('StorytellingsController', () => {
  let controller: StorytellingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorytellingsController],
      providers: [StorytellingsService],
    }).compile();

    controller = module.get<StorytellingsController>(StorytellingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
