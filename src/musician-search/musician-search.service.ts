import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { FilterResolverService } from './musician-search.filter.resolver';

export interface SearchMusiciansParams {
  userId: string;
  radiusKm: number;
  instrumentFilter?: string[];
  genreFilter?: string[];
  bandFilter?: string[];
  theoryLevels?: string[];
  limit?: number;
  offset?: number;
}

export interface MusicianSearchResult {
  id: string;
  name: string;
  profile_photo_url: string | null;
  distance_km: number;
  location: string;
  instruments?: string;
  genres?: string;
  bands?: string;
  theoryLevels?: string;
}

@Injectable()
export class MusicianSearchService {
  constructor(
    private supabaseService: SupabaseService,
    private filterResolver: FilterResolverService,
  ) {}

  async searchAdvancedByNames(
    userId: string,
    radiusKm: number,
    filters: {
      instruments?: string[];
      genres?: string[];
      bands?: string[];
      theoryLevels?: string[];
    },
    limit?: number,
  ): Promise<MusicianSearchResult[]> {
    this.validateSearchParams(userId, radiusKm);

    const resolvedFilters = await this.filterResolver.resolveAllFilters({
      instruments: filters.instruments,
      genres: filters.genres,
      bands: filters.bands,
    });

    return this.searchMusicians({
      userId,
      radiusKm,
      instrumentFilter: resolvedFilters.instrumentIds,
      genreFilter: resolvedFilters.genreIds,
      bandFilter: resolvedFilters.bandIds,
      theoryLevels: filters.theoryLevels,
      limit,
    });
  }

  async searchMusicians(
    params: SearchMusiciansParams,
  ): Promise<MusicianSearchResult[]> {
    const {
      userId,
      radiusKm,
      instrumentFilter,
      genreFilter,
      bandFilter,
      theoryLevels,
      limit = 100,
      offset = 0,
    } = params;

    this.validateSearchParams(userId, radiusKm);

    const { data, error } = await this.supabaseService
      .getClient()
      .rpc('search_musicians', {
        p_user_id: userId,
        p_radius_km: radiusKm,
        p_instrument_filter: instrumentFilter,
        p_genre_filter: genreFilter,
        p_band_filter: bandFilter,
        p_theory_levels: theoryLevels,
        p_limit: limit,
        p_offset: offset,
      });

    if (error) {
      throw new BadRequestException(`Search failed: ${error.message}`);
    }

    return (data || []) as MusicianSearchResult[];
  }

  async searchNearby(
    userId: string,
    radiusKm: number,
    limit?: number,
  ): Promise<MusicianSearchResult[]> {
    return this.searchMusicians({
      userId,
      radiusKm,
      limit,
    });
  }

  async searchByInstrument(
    userId: string,
    radiusKm: number,
    instrumentIds: string[],
    limit?: number,
  ): Promise<MusicianSearchResult[]> {
    return this.searchMusicians({
      userId,
      radiusKm,
      instrumentFilter: instrumentIds,
      limit,
    });
  }

  async searchRandom(): Promise<MusicianSearchResult[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .rpc('feature_random_users', {
        p_count: 10,
      });

    if (error) {
      throw new BadRequestException(
        `Failed to fetch random musicians: ${error.message}`,
      );
    }

    return (data || []) as MusicianSearchResult[];
  }

  private validateSearchParams(userId: string, radiusKm: number): void {
    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    if (!radiusKm || radiusKm <= 0) {
      throw new BadRequestException('Radius must be greater than 0');
    }

    if (radiusKm > 500) {
      throw new BadRequestException('Radius cannot exceed 500 km');
    }
  }
}
