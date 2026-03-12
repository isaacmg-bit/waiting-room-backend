import { Test, TestingModule } from '@nestjs/testing';
import { UserBandsService } from './user-bands.service';

describe('UserBandsService', () => {
  let service: UserBandsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBandsService],
    }).compile();

    service = module.get<UserBandsService>(UserBandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
