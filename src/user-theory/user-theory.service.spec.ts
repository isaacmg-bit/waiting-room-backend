import { Test, TestingModule } from '@nestjs/testing';
import { UserTheoryService } from './user-theory.service';

describe('UserTheoryService', () => {
  let service: UserTheoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTheoryService],
    }).compile();

    service = module.get<UserTheoryService>(UserTheoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
