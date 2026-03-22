import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UserTheoryService } from './user-theory.service';
import { CreateUserTheoryDto } from './dto/create-user-theory.dto';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@UseGuards(SupabaseTokenGuard)
@Controller('user-theory')
export class UserTheoryController {
  constructor(private readonly userTheoryService: UserTheoryService) {}

  @Get('me')
  async findMe(@Req() req) {
    const client = req.supabaseClient;
    const authUserId = req.user?.id;
    const result = await this.userTheoryService.findByUserId(
      authUserId,
      client,
    );
    if (!result) {
      throw new NotFoundException('User theory not found');
    }
    return result;
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string, @Req() req) {
    const client = req.supabaseClient;
    return this.userTheoryService.findByUserId(userId, client);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateUserTheoryDto) {
    const client = req.supabaseClient;
    const authUserId = req.user?.id;

    return this.userTheoryService.upsert(authUserId, dto, client, authUserId);
  }

  @Patch('me')
  async update(@Req() req, @Body() dto: CreateUserTheoryDto) {
    const client = req.supabaseClient;
    const authUserId = req.user?.id;

    return this.userTheoryService.upsert(authUserId, dto, client, authUserId);
  }
}
