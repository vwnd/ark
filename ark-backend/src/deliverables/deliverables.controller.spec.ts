import { Test, TestingModule } from '@nestjs/testing';
import { DeliverablesController } from './deliverables.controller';

describe('DeliverablesController', () => {
  let controller: DeliverablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverablesController],
    }).compile();

    controller = module.get<DeliverablesController>(DeliverablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
