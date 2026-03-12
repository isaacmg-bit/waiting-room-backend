import { Test, TestingModule } from '@nestjs/testing';
import { UserBandsController } from './user-bands.controller';
import { UserBandsService } from './user-bands.service';

describe('UserBandsController', () => {
  let controller: UserBandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBandsController],
      providers: [UserBandsService],
    }).compile();

    controller = module.get<UserBandsController>(UserBandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
