import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserInstrumentsService } from './user-instruments.service';
import { CreateUserInstrumentDto } from './dto/create-user-instrument.dto';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(SupabaseTokenGuard)
@Controller('user-instruments')
export class UserInstrumentsController {
  constructor(
    private readonly userInstrumentsService: UserInstrumentsService,
  ) {}

  @Get('me')
  findAll(@Req() req) {
    const client = req.supabaseClient;
    return this.userInstrumentsService.findByUserId(req.user.id, client);
  }

  @Get(':userId')
  getInstrumentsByUserId(@Param('userId') userId: string, @Req() req) {
    const client = req.supabaseClient;

    // Opcional: pequeño log para depuración (borra en producción)

    console.debug(
      '[user-instruments] getInstrumentsByUserId userId=%s auth=%o',
      userId,
      req.user?.id,
    );

    return;

    this.userInstrumentsService.findByUserId(userId, client);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateUserInstrumentDto) {
    const client = req.supabaseClient;
    return this.userInstrumentsService.create(req.user.id, dto, client);
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
