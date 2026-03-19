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
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Req() req, @Body() createLocationDto: CreateLocationDto) {
    console.log('User:', req.user);
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll(@Req() req) {
    console.log('User:', req.user);
    return this.locationsService.findAll();
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    console.log('User:', req.user);
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    console.log('User:', req.user);
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    console.log('User:', req.user);
    return this.locationsService.remove(id);
  }
}
