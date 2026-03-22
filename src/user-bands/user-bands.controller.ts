import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserBandsService } from './user-bands.service';
import { UseGuards } from '@nestjs/common';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';
import { Req } from '@nestjs/common';
import { CreateUserBandDto } from './dto/create-user-band.dto';

@UseGuards(SupabaseTokenGuard)
@Controller('user-bands')
export class UserBandsController {
  constructor(private readonly userBandsService: UserBandsService) {}

  @Get('me')
  findAll(@Req() req) {
    const client = req.supabaseClient;
    return this.userBandsService.findByUserId(req.user.id, client);
  }

  @Get(':userId')
  getBandsByUserId(@Param('userId') userId: string) {
    return this.userBandsService.findByUserId(userId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserBandDto) {
    const client = req.supabaseClient;
    return this.userBandsService.create(req.user.id, dto, client);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBandsService.remove(id);
  }
}
