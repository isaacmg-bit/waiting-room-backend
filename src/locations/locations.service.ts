import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DeleteResult } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UserLocation } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(UserLocation.name) private locationModel: Model<UserLocation>,
  ) {}
  async create(
    createLocationDto: CreateLocationDto,
  ): Promise<UserLocation | null> {
    const newLocation = new this.locationModel(createLocationDto);
    return await newLocation.save();
  }

  async findAll(): Promise<UserLocation[] | null> {
    return await this.locationModel.find().exec();
  }

  async findOne(id: string): Promise<UserLocation | null> {
    return await this.locationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<UserLocation | null> {
    return await this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { returnDocument: 'after' })
      .exec();
  }

  async remove(id: string): Promise<UserLocation | null> {
    return await this.locationModel.findByIdAndDelete(id).exec();
  }

  async removeAll(): Promise<DeleteResult> {
    return await this.locationModel.deleteMany({}).exec();
  }
}
