import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}
  async create(createLocationDto: CreateLocationDto): Promise<Location | null> {
    const newLocation = new this.locationModel(createLocationDto);
    return await newLocation.save();
  }

  async findAll(): Promise<Location[] | null> {
    return await this.locationModel.find().exec();
  }

  async findOne(id: string): Promise<Location | null> {
    return await this.locationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location | null> {
    return await this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { returnDocument: 'after' })
      .exec();
  }

  async remove(id: string): Promise<Location | null> {
    return await this.locationModel.findByIdAndDelete(id).exec();
  }
}
