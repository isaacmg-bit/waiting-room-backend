import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class GenresService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async findAll(client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('genres')
      .select('*');

    if (error) throw error;
    return data;
  }
}
