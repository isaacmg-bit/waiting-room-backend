import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(SupabaseTokenGuard)
  @Post()
  async create(@Req() req, @Body() dto: CreateEventDto) {
    const client = req.supabaseClient;
    return this.eventsService.create(req.user.id, dto, client);
  }

  @UseGuards(SupabaseTokenGuard)
  @Get('me')
  async findAllMe(@Req() req) {
    const client = req.supabaseClient;
    return this.eventsService.findAllMe(req.user.id, client);
  }

  @Get('public')
  async findAllPublic() {
    return this.eventsService.findAllPublic();
  }

  @UseGuards(SupabaseTokenGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const client = req.supabaseClient;
    return this.eventsService.findOne(id, req.user.id, client);
  }

  @UseGuards(SupabaseTokenGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req,
  ) {
    const client = req.supabaseClient;
    return this.eventsService.update(id, dto, req.user.id, client);
  }

  @UseGuards(SupabaseTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const client = req.supabaseClient;
    return this.eventsService.remove(id, req.user.id, client);
  }
}
