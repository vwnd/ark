import { Test, TestingModule } from '@nestjs/testing';
import { ModelsResolver } from './models.resolver';

describe('ModelsResolver', () => {
  let resolver: ModelsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelsResolver],
    }).compile();

    resolver = module.get<ModelsResolver>(ModelsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
