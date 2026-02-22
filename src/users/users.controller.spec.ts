import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should call create with the dto', () => {
    const dto = { name: 'Alice', email: 'alice@mail.com', location: 'Madrid' };
    controller.create(dto);
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll', () => {
    controller.findAll();
    expect(mockUsersService.findAll).toHaveBeenCalled();
  });

  it('should call findOne with the correct id', () => {
    controller.findOne('u1');
    expect(mockUsersService.findOne).toHaveBeenCalledWith('u1');
  });

  it('should call update with the correct id and dto', () => {
    const dto = { name: 'Updated' };
    controller.update('u1', dto);
    expect(mockUsersService.update).toHaveBeenCalledWith('u1', dto);
  });

  it('should call remove with the correct id', () => {
    controller.remove('u1');
    expect(mockUsersService.remove).toHaveBeenCalledWith('u1');
  });
});
