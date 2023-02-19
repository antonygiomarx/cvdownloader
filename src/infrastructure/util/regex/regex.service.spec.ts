import { Test, TestingModule } from '@nestjs/testing';
import { RegexService } from './regex.service';

describe('RegexService', () => {
  let service: RegexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegexService],
    }).compile();

    service = module.get<RegexService>(RegexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
