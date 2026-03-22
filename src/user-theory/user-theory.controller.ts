import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UserTheoryService } from './user-theory.service';
import { CreateUserTheoryDto } from './dto/create-user-theory.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, Req } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@Controller('user-theory')
export class UserTheoryController {
  constructor(private readonly userTheoryService: UserTheoryService) {}

  @Get('me')
  findMe(@Req() req) {
    return this.userTheoryService.findByUserId(req.user.id);
  }

  @Get(':userId')
  getTheoryByUserId(@Param('userId') userId: string) {
    return this.userTheoryService.findByUserId(userId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserTheoryDto) {
    return this.userTheoryService.upsert(req.user.id, dto);
  }

  @Patch('me')
  update(@Req() req, @Body() dto: CreateUserTheoryDto) {
    return this.userTheoryService.upsert(req.user.id, dto);
  }
}
