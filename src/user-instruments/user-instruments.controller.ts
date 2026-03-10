import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserInstrumentsService } from './user-instruments.service';
import { CreateUserInstrumentDto } from './dto/create-user-instrument.dto';
import { UpdateUserInstrumentDto } from './dto/update-user-instrument.dto';

@Controller('user-instruments')
export class UserInstrumentsController {
  constructor(private readonly userInstrumentsService: UserInstrumentsService) {}

  @Post()
  create(@Body() createUserInstrumentDto: CreateUserInstrumentDto) {
    return this.userInstrumentsService.create(createUserInstrumentDto);
  }

  @Get()
  findAll() {
    return this.userInstrumentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userInstrumentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserInstrumentDto: UpdateUserInstrumentDto) {
    return this.userInstrumentsService.update(+id, updateUserInstrumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userInstrumentsService.remove(+id);
  }
}
