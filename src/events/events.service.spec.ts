import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { CalendarEvent } from './entities/event.entity';

const mockEvent = {
  _id: 'e1',
  title: 'Concert',
  date: '2025-06-01',
  color: 'red',
};

const mockEventModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteMany: jest.fn(),
};

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(CalendarEvent.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      mockEventModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockEvent]),
      });

      const result = await service.findAll();

      expect(result).toEqual([mockEvent]);
      expect(mockEventModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the event with the given id', async () => {
      mockEventModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvent),
      });

      const result = await service.findOne('e1');

      expect(result).toEqual(mockEvent);
      expect(mockEventModel.findById).toHaveBeenCalledWith('e1');
    });

    it('should return null if the event does not exist', async () => {
      mockEventModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should return the updated event', async () => {
      const updated = { ...mockEvent, title: 'Updated' };
      mockEventModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      });

      const result = await service.update('e1', { title: 'Updated' });

      expect(result).toEqual(updated);
      expect(mockEventModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'e1',
        { title: 'Updated' },
        { returnDocument: 'after' },
      );
    });

    it('should return null if the event does not exist', async () => {
      mockEventModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.update('nonexistent', { title: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should return the deleted event', async () => {
      mockEventModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockEvent),
      });

      const result = await service.remove('e1');

      expect(result).toEqual(mockEvent);
      expect(mockEventModel.findByIdAndDelete).toHaveBeenCalledWith('e1');
    });

    it('should return null if the event does not exist', async () => {
      mockEventModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.remove('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('removeAll', () => {
    it('should call deleteMany and return the result', async () => {
      const deleteResult = { deletedCount: 3, acknowledged: true };
      mockEventModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue(deleteResult),
      });

      const result = await service.removeAll();

      expect(result).toEqual(deleteResult);
      expect(mockEventModel.deleteMany).toHaveBeenCalledWith({});
    });
  });

  describe('create', () => {
    it('should save and return the new event', async () => {
      const dto = { title: 'Concert', date: '2025-06-01', color: 'red' };
      const saveMock = jest.fn().mockResolvedValue({ _id: 'e1', ...dto });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EventsService,
          {
            provide: getModelToken(CalendarEvent.name),
            useValue: jest.fn().mockImplementation(() => ({ save: saveMock })),
          },
        ],
      }).compile();

      const serviceWithConstructor = module.get<EventsService>(EventsService);
      const result = await serviceWithConstructor.create(dto);

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'e1', ...dto });
    });
  });
});
