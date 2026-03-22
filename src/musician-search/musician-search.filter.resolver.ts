import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

export interface ResolvedFilters {
  instrumentIds?: string[];
  genreIds?: string[];
  bandIds?: string[];
}

@Injectable()
export class FilterResolverService {
  constructor(private supabaseService: SupabaseService) {}

  async resolveGenreIds(genreNames: string[]): Promise<string[] | undefined> {
    if (!genreNames || genreNames.length === 0) {
      return undefined;
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('genres')
      .select('id')
      .in('genre', genreNames);

    if (error) {
      throw new BadRequestException(
        `Failed to resolve genres: ${error.message}`,
      );
    }

    return data?.map((g) => g.id) ?? [];
  }

  async resolveInstrumentIds(
    instrumentNames: string[],
  ): Promise<string[] | undefined> {
    if (!instrumentNames || instrumentNames.length === 0) {
      return undefined;
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('instruments')
      .select('id')
      .in('instrument_name', instrumentNames);

    if (error) {
      throw new BadRequestException(
        `Failed to resolve instruments: ${error.message}`,
      );
    }

    return data?.map((i) => i.id) ?? [];
  }

  async resolveBandIds(bandNames: string[]): Promise<string[] | undefined> {
    if (!bandNames || bandNames.length === 0) {
      return undefined;
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_bands')
      .select('band_id')
      .in('name', bandNames);

    if (error) {
      throw new BadRequestException(
        `Failed to resolve bands: ${error.message}`,
      );
    }

    return data?.map((b) => b.band_id) ?? [];
  }

  async resolveAllFilters(filters: {
    instruments?: string[];
    genres?: string[];
    bands?: string[];
  }): Promise<ResolvedFilters> {
    const [instrumentIds, genreIds, bandIds] = await Promise.all([
      filters.instruments?.length
        ? this.resolveInstrumentIds(filters.instruments)
        : Promise.resolve(undefined),
      filters.genres?.length
        ? this.resolveGenreIds(filters.genres)
        : Promise.resolve(undefined),
      filters.bands?.length
        ? this.resolveBandIds(filters.bands)
        : Promise.resolve(undefined),
    ]);

    return {
      instrumentIds,
      genreIds,
      bandIds,
    };
  }
}
