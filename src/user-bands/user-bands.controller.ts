import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserBandsService } from './user-bands.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { CreateUserBandDto } from './dto/create-user-band.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user-bands')
export class UserBandsController {
  constructor(private readonly userBandsService: UserBandsService) {}

  @Get('me')
  findAll(@Req() req) {
    return this.userBandsService.findByUserId(req.user.id);
  }

  @Get(':userId')
  getBandsByUserId(@Param('userId') userId: string) {
    return this.userBandsService.findByUserId(userId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserBandDto) {
    return this.userBandsService.create(req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBandsService.remove(id);
  }
}
