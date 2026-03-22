import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class InstrumentsService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async findAll(client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('instruments')
      .select('*')
      .order('instrument_family');

    if (error) throw error;
    return data;
  }
}
