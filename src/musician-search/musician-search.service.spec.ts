import { Test, TestingModule } from '@nestjs/testing';
import { MusicianSearchService } from './musician-search.service';

describe('MusicianSearchService', () => {
  let service: MusicianSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicianSearchService],
    }).compile();

    service = module.get<MusicianSearchService>(MusicianSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
