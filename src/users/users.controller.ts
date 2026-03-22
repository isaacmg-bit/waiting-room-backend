import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-userprofile.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserProfileDto } from './dto/create-userprofile.dto';
import { SupabasePerRequestService } from '../supabase/supabase-per-request-service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sbPerRequest: SupabasePerRequestService,
  ) {}

  @Get() findAll() {
    return this.usersService.findAll();
  }

  @Get('me') async getMe(@Req() req) {
    const userId = req.user.id;
    const user = await this.usersService.findOne(userId);
    if (!user) {
      return req.user;
    }
    return user;
  }

  @Get(':id') findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id') update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserProfileDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('profile-sync') async create(
    @Req() req,
    @Body() dto: CreateUserProfileDto,
  ) {
    const authHeader = req.headers?.authorization as string | undefined;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) {
      throw new UnauthorizedException('Malformed Authorization header');
    }

    const userId = await this.sbPerRequest.verifyTokenAndGetUserId(token);
  }
}
