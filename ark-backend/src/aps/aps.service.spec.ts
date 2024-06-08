import { Test, TestingModule } from '@nestjs/testing';
import { ApsService } from './aps.service';

describe('ApsService', () => {
  let service: ApsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApsService],
    }).compile();

    service = module.get<ApsService>(ApsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
