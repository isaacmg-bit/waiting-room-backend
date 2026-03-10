import { Test, TestingModule } from '@nestjs/testing';
import { UserInstrumentsController } from './user-instruments.controller';
import { UserInstrumentsService } from './user-instruments.service';

describe('UserInstrumentsController', () => {
  let controller: UserInstrumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInstrumentsController],
      providers: [UserInstrumentsService],
    }).compile();

    controller = module.get<UserInstrumentsController>(UserInstrumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
