import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserInstrumentsService } from './user-instruments.service';
import { CreateUserInstrumentDto } from './dto/create-user-instrument.dto';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@Controller('user-instruments')
export class UserInstrumentsController {
  constructor(
    private readonly userInstrumentsService: UserInstrumentsService,
  ) {}

  @Get('me')
  findAll(@Req() req) {
    return this.userInstrumentsService.findByUser(req.user.id);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserInstrumentDto) {
    return this.userInstrumentsService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateUserInstrumentDto) {
    return this.userInstrumentsService.update(id, dto.level);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userInstrumentsService.remove(id);
  }
}
