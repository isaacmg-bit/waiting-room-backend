import { Test, TestingModule } from '@nestjs/testing';
import { UserTheoryController } from './user-theory.controller';
import { UserTheoryService } from './user-theory.service';

describe('UserTheoryController', () => {
  let controller: UserTheoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTheoryController],
      providers: [UserTheoryService],
    }).compile();

    controller = module.get<UserTheoryController>(UserTheoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
