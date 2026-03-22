import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@UseGuards(SupabaseTokenGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Req() req, @Body() createLocationDto: CreateLocationDto) {
    const client = req.supabaseClient;
    return this.locationsService.create(createLocationDto, client);
  }

  @Get()
  findAll(@Req() req) {
    const client = req.supabaseClient;

    return this.locationsService.findAll(client);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const client = req.supabaseClient;
    return this.locationsService.findOne(id, client);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const client = req.supabaseClient;

    return this.locationsService.update(id, updateLocationDto, client);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const client = req.supabaseClient;
    return this.locationsService.remove(id, client);
  }
}
