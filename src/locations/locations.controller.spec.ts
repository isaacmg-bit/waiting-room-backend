import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

const mockLocationsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeAll: jest.fn(),
};

describe('LocationsController', () => {
  let controller: LocationsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        { provide: LocationsService, useValue: mockLocationsService },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
  });

  it('should call create with the dto', () => {
    const dto = {
      name: 'Venue',
      lat: 40.4,
      lng: -3.7,
      description: 'Nice',
      category: 'show',
    };
    controller.create(dto);
    expect(mockLocationsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll', () => {
    controller.findAll();
    expect(mockLocationsService.findAll).toHaveBeenCalled();
  });

  it('should call findOne with the correct id', () => {
    controller.findOne('loc1');
    expect(mockLocationsService.findOne).toHaveBeenCalledWith('loc1');
  });

  it('should call update with the correct id and dto', () => {
    const dto = { name: 'Updated' };
    controller.update('loc1', dto);
    expect(mockLocationsService.update).toHaveBeenCalledWith('loc1', dto);
  });

  it('should call remove with the correct id', () => {
    controller.remove('loc1');
    expect(mockLocationsService.remove).toHaveBeenCalledWith('loc1');
  });

  it('should call removeAll', () => {
    controller.removeAll();
    expect(mockLocationsService.removeAll).toHaveBeenCalled();
  });
});
