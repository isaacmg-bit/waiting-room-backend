import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-userprofile.dto';
import { CreateUserProfileDto } from './dto/create-userprofile.dto';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@UseGuards(SupabaseTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Req() req) {
    const client = req.supabaseClient;
    return this.usersService.findAll(client);
  }

  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.id;
    const client = req.supabaseClient;

    const user = await this.usersService.findOne(userId, client);

    if (!user) {
      return req.user;
    }

    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const client = req.supabaseClient;
    return this.usersService.findOne(id, client);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserProfileDto,
    @Req() req,
  ) {
    const client = req.supabaseClient;
    return this.usersService.update(id, updateUserDto, client);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const client = req.supabaseClient;
    return this.usersService.remove(id, client);
  }

  @Post('profile-sync')
  create(@Req() req, @Body() dto: CreateUserProfileDto) {
    const client = req.supabaseClient;
    return this.usersService.create(req.user.id, req.user.email, dto, client);
  }
}
