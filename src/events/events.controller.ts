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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@UseGuards(AuthGuard('jwt'))
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateEventDto) {
    return await this.eventsService.create(req.user.id, dto);
  }

  @Get('me')
  async findAllMe(@Req() req: AuthenticatedRequest) {
    return await this.eventsService.findAllMe(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return await this.eventsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.eventsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return await this.eventsService.remove(id, req.user.id);
  }
}
