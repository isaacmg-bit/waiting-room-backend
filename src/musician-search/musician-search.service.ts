import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

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
  constructor(private supabaseService: SupabaseService) {}

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
      throw new Error(`Search failed: ${error.message}`);
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

  async searchAdvanced(
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
    return this.searchMusicians({
      userId,
      radiusKm,
      instrumentFilter: filters.instruments,
      genreFilter: filters.genres,
      bandFilter: filters.bands,
      theoryLevels: filters.theoryLevels,
      limit,
    });
  }

  async searchRandom(): Promise<MusicianSearchResult[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .rpc('feature_random_users', {
        p_count: 4,
      });

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    return (data || []) as MusicianSearchResult[];
  }
}
