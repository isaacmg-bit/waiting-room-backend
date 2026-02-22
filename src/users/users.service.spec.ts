import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

const mockUser = {
  _id: 'u1',
  name: 'Alice',
  email: 'alice@mail.com',
  location: 'Madrid',
};

const mockUserModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockUser]),
      });

      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the user with the given id', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne('u1');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('u1');
    });

    it('should return null if the user does not exist', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should return the updated user', async () => {
      const updated = { ...mockUser, name: 'Updated' };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('u1', { name: 'Updated' });

      expect(result).toEqual(updated);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'u1',
        { name: 'Updated' },
        { returnDocument: 'after' },
      );
    });

    it('should return null if the user does not exist', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.update('nonexistent', { name: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return the deleted user', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.remove('u1');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('u1');
    });

    it('should return null if the user does not exist', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.remove('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should save and return the new user', async () => {
      const dto = {
        name: 'Alice',
        email: 'alice@mail.com',
        location: 'Madrid',
      };
      const saveMock = jest.fn().mockResolvedValue({ _id: 'u1', ...dto });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getModelToken(User.name),
            useValue: jest.fn().mockImplementation(() => ({ save: saveMock })),
          },
        ],
      }).compile();

      const serviceWithConstructor = module.get<UsersService>(UsersService);
      const result = await serviceWithConstructor.create(dto);

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'u1', ...dto });
    });
  });
});
