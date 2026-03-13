import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserGenresService } from './user-genres.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { CreateUserGenreDto } from './dto/create-user-genre.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user-genres')
export class UserGenresController {
  constructor(private readonly userGenresService: UserGenresService) {}

  @Get('me')
  findAll(@Req() req) {
    return this.userGenresService.findByUserId(req.user.id);
  }

  @Get(':userId')
  getGenreByUserId(@Param('userId') userId: string) {
    return this.userGenresService.findByUserId(userId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserGenreDto) {
    return this.userGenresService.create(req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGenresService.remove(id);
  }
}
