import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DeleteResult } from 'mongoose';
import { CalendarEvent } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(CalendarEvent.name) private eventModel: Model<CalendarEvent>,
  ) {}
  async create(createEventDto: CreateEventDto): Promise<CalendarEvent | null> {
    const newEvent = new this.eventModel(createEventDto);
    return await newEvent.save();
  }

  async findAll(): Promise<CalendarEvent[] | null> {
    return await this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<CalendarEvent | null> {
    return await this.eventModel.findById(id).exec();
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<CalendarEvent | null> {
    return await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { returnDocument: 'after' })
      .exec();
  }

  async remove(id: string): Promise<CalendarEvent | null> {
    return await this.eventModel.findByIdAndDelete(id).exec();
  }

  async removeAll(): Promise<DeleteResult> {
    return await this.eventModel.deleteMany({}).exec();
  }
}
