import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

const mockEventsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeAll: jest.fn(),
};

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockEventsService }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should call create with the dto', () => {
    const dto = { title: 'Concert', date: '2025-06-01', color: 'red' };
    controller.create(dto);
    expect(mockEventsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll', () => {
    controller.findAll();
    expect(mockEventsService.findAll).toHaveBeenCalled();
  });

  it('should call findOne with the correct id', () => {
    controller.findOne('e1');
    expect(mockEventsService.findOne).toHaveBeenCalledWith('e1');
  });

  it('should call update with the correct id and dto', () => {
    const dto = { title: 'Updated' };
    controller.update('e1', dto);
    expect(mockEventsService.update).toHaveBeenCalledWith('e1', dto);
  });

  it('should call remove with the correct id', () => {
    controller.remove('e1');
    expect(mockEventsService.remove).toHaveBeenCalledWith('e1');
  });

  it('should call removeAll', () => {
    controller.removeAll();
    expect(mockEventsService.removeAll).toHaveBeenCalled();
  });
});
