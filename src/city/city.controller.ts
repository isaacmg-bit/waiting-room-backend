import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.cityService.searchNominatim(query);
  }
}
