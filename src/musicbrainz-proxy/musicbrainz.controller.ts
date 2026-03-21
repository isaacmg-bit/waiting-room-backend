// src/musicbrainz/musicbrainz.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MusicbrainzService } from './musicbrainz.service';

@Controller('api/musicbrainz')
export class MusicbrainzController {
  constructor(private readonly musicbrainzService: MusicbrainzService) {}

  @Get('search')
  async search(@Query('query') query: string) {
    return await this.musicbrainzService.searchArtists(query);
  }
}
