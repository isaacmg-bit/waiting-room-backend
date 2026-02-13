import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DeleteResult } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}
  async create(CreateEventDto: CreateEventDto): Promise<Event | null> {
    const newEvent = new this.eventModel(CreateEventDto);
    return await newEvent.save();
  }

  async findAll(): Promise<Event[] | null> {
    return await this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event | null> {
    return await this.eventModel.findById(id).exec();
  }

  async update(
    id: string,
    UpdateEventDto: UpdateEventDto,
  ): Promise<Event | null> {
    return await this.eventModel
      .findByIdAndUpdate(id, UpdateEventDto, { returnDocument: 'after' })
      .exec();
  }

  async remove(id: string): Promise<Event | null> {
    return await this.eventModel.findByIdAndDelete(id).exec();
  }

  async removeAll(): Promise<DeleteResult> {
    return await this.eventModel.deleteMany({}).exec();
  }
}
