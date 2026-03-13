import { Test, TestingModule } from '@nestjs/testing';
import { MusicianSearchController } from './musician-search.controller';
import { MusicianSearchService } from './musician-search.service';

describe('MusicianSearchController', () => {
  let controller: MusicianSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicianSearchController],
      providers: [MusicianSearchService],
    }).compile();

    controller = module.get<MusicianSearchController>(MusicianSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
