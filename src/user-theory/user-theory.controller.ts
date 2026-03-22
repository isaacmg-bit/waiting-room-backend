import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { UserTheoryService } from './user-theory.service';
import { CreateUserTheoryDto } from './dto/create-user-theory.dto';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';
import { NotFoundException } from '@nestjs/common';

@UseGuards(SupabaseTokenGuard)
@Controller('user-theory')
export class UserTheoryController {
  constructor(private readonly userTheoryService: UserTheoryService) {}

  @Get('me')
  async findMe(@Req() req) {
    const client = req.supabaseClient;
    const result = await this.userTheoryService.findByUserId(
      req.user.id,
      client,
    );
    if (!result) {
      throw new NotFoundException('User theory not found');
    }
    return result;
  }

  @Get(':userId')
  findByUserId(@Param('userId') userId: string, @Req() req) {
    const client = req.supabaseClient;
    return this.userTheoryService.findByUserId(userId, client);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserTheoryDto) {
    const client = req.supabaseClient;
    return this.userTheoryService.upsert(req.user.id, dto, client);
  }

  @Patch('me')
  update(@Req() req, @Body() dto: CreateUserTheoryDto) {
    const client = req.supabaseClient;
    return this.userTheoryService.upsert(req.user.id, dto, client);
  }
}
