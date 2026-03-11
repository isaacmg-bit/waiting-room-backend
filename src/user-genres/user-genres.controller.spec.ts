import { Test, TestingModule } from '@nestjs/testing';
import { UserGenresController } from './user-genres.controller';
import { UserGenresService } from './user-genres.service';

describe('UserGenresController', () => {
  let controller: UserGenresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGenresController],
      providers: [UserGenresService],
    }).compile();

    controller = module.get<UserGenresController>(UserGenresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
