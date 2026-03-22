import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserGenresService } from './user-genres.service';
import { UseGuards } from '@nestjs/common';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';
import { Req } from '@nestjs/common';
import { CreateUserGenreDto } from './dto/create-user-genre.dto';

@UseGuards(SupabaseTokenGuard)
@Controller('user-genres')
export class UserGenresController {
  constructor(private readonly userGenresService: UserGenresService) {}

  @Get('me')
  findAll(@Req() req) {
    const client = req.supabaseClient;
    return this.userGenresService.findByUserId(req.user.id, client);
  }

  @Get(':userId')
  getGenreByUserId(@Param('userId') userId: string) {
    return this.userGenresService.findByUserId(userId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserGenreDto) {
    const client = req.supabaseClient;
    return this.userGenresService.create(req.user.id, dto, client);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGenresService.remove(id);
  }
}
