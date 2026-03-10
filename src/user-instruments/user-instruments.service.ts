import { Injectable } from '@nestjs/common';
import { CreateUserInstrumentDto } from './dto/create-user-instrument.dto';
import { UpdateUserInstrumentDto } from './dto/update-user-instrument.dto';

@Injectable()
export class UserInstrumentsService {
  create(createUserInstrumentDto: CreateUserInstrumentDto) {
    return 'This action adds a new userInstrument';
  }

  findAll() {
    return `This action returns all userInstruments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userInstrument`;
  }

  update(id: number, updateUserInstrumentDto: UpdateUserInstrumentDto) {
    return `This action updates a #${id} userInstrument`;
  }

  remove(id: number) {
    return `This action removes a #${id} userInstrument`;
  }
}
