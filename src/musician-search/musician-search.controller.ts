import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import {
  MusicianSearchService,
  MusicianSearchResult,
} from './musician-search.service';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from 'src/supabase/supabase.service';

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

@UseGuards(AuthGuard('jwt'))
@Controller('search')
export class MusicianSearchController {
  constructor(
    private readonly musicianSearchService: MusicianSearchService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get('musicians/advanced')
  async searchAdvanced(
    @Req() req: AuthRequest,
    @Query('radiusKm') radiusKm: string,
    @Query('instruments') instruments?: string,
    @Query('genres') genres?: string,
    @Query('bands') bands?: string,
    @Query('theoryLevels') theoryLevels?: string,
    @Query('limit') limit?: string,
  ): Promise<MusicianSearchResult[]> {
    if (!radiusKm) throw new Error('radiusKm is required');

    const instrumentNames = instruments
      ? instruments.split(',').map((i) => i.trim())
      : undefined;
    const genreNames = genres
      ? genres.split(',').map((g) => g.trim())
      : undefined;
    const bandNames = bands ? bands.split(',').map((b) => b.trim()) : undefined;
    const theoryArray = theoryLevels
      ? theoryLevels.split(',').map((t) => t.trim())
      : undefined;

    const genreIds = genreNames?.length
      ? ((
          await this.supabaseService
            .getClient()
            .from('genres')
            .select('id')
            .in('genre', genreNames)
        ).data?.map((g) => g.id) ?? [])
      : undefined;

    const instrumentIds = instrumentNames?.length
      ? ((
          await this.supabaseService
            .getClient()
            .from('instruments')
            .select('id')
            .in('instrument_name', instrumentNames)
        ).data?.map((i) => i.id ?? '') ?? [])
      : undefined;

    const bandIds = bandNames?.length
      ? ((
          await this.supabaseService
            .getClient()
            .from('user_bands')
            .select('band_id')
            .in('name', bandNames)
        ).data?.map((b) => b.band_id) ?? [])
      : undefined;

    return this.musicianSearchService.searchAdvanced(
      req.user.id,
      parseFloat(radiusKm),
      {
        instruments: instrumentIds,
        genres: genreIds,
        bands: bandIds,
        theoryLevels: theoryArray,
      },
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('musicians/random')
  async getRandomMusicians(): Promise<MusicianSearchResult[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .rpc('feature_random_users', { p_count: 10 });
    if (error)
      throw new Error(`Failed to get random musicians: ${error.message}`);
    return (data || []) as MusicianSearchResult[];
  }
}
