import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LocationsService } from './locations.service';
import { UserLocation } from './entities/location.entity';

const mockLocation = {
  _id: 'loc1',
  name: 'Venue',
  lat: 40.4,
  lng: -3.7,
  description: 'Nice',
  category: 'show',
};

const mockLocationModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteMany: jest.fn(),
};

describe('LocationsService', () => {
  let service: LocationsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getModelToken(UserLocation.name),
          useValue: mockLocationModel,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  describe('findAll', () => {
    it('should return all locations', async () => {
      mockLocationModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLocation]),
      });

      const result = await service.findAll();

      expect(result).toEqual([mockLocation]);
      expect(mockLocationModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the location with the given id', async () => {
      mockLocationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLocation),
      });

      const result = await service.findOne('loc1');

      expect(result).toEqual(mockLocation);
      expect(mockLocationModel.findById).toHaveBeenCalledWith('loc1');
    });

    it('should return null if the location does not exist', async () => {
      mockLocationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should return the updated location', async () => {
      const updated = { ...mockLocation, name: 'Updated' };
      mockLocationModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('loc1', { name: 'Updated' });

      expect(result).toEqual(updated);
      expect(mockLocationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'loc1',
        { name: 'Updated' },
        { returnDocument: 'after' },
      );
    });

    it('should return null if the location does not exist', async () => {
      mockLocationModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.update('nonexistent', { name: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return the deleted location', async () => {
      mockLocationModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLocation),
      });

      const result = await service.remove('loc1');

      expect(result).toEqual(mockLocation);
      expect(mockLocationModel.findByIdAndDelete).toHaveBeenCalledWith('loc1');
    });

    it('should return null if the location does not exist', async () => {
      mockLocationModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.remove('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('removeAll', () => {
    it('should call deleteMany and return the result', async () => {
      const deleteResult = { deletedCount: 2, acknowledged: true };
      mockLocationModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deleteResult),
      });

      const result = await service.removeAll();

      expect(result).toEqual(deleteResult);
      expect(mockLocationModel.deleteMany).toHaveBeenCalledWith({});
    });
  });

  describe('create', () => {
    it('should save and return the new location', async () => {
      const dto = {
        name: 'Venue',
        lat: 40.4,
        lng: -3.7,
        description: 'Nice',
        category: 'show',
      };
      const saveMock = jest.fn().mockResolvedValue({ _id: 'loc1', ...dto });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LocationsService,
          {
            provide: getModelToken(UserLocation.name),
            useValue: jest.fn().mockImplementation(() => ({ save: saveMock })),
          },
        ],
      }).compile();

      const serviceWithConstructor =
        module.get<LocationsService>(LocationsService);
      const result = await serviceWithConstructor.create(dto);

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'loc1', ...dto });
    });
  });
});
