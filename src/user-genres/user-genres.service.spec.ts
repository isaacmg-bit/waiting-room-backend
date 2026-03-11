import { Test, TestingModule } from '@nestjs/testing';
import { UserGenresService } from './user-genres.service';

describe('UserGenresService', () => {
  let service: UserGenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGenresService],
    }).compile();

    service = module.get<UserGenresService>(UserGenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
