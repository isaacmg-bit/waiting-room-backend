import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateUserInstrumentDto } from './dto/create-user-instrument.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UserInstrumentsService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async findByUserId(userId: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_instruments')
      .select('*, instruments(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async create(
    userId: string,
    dto: CreateUserInstrumentDto,
    client?: SupabaseClient,
  ) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_instruments')
      .insert({
        user_id: userId,
        instrument_id: dto.instrument_id,
        level: dto.level,
      })
      .select(
        `
      id,
      level,
      instrument_id,
      instruments (
        id,
        instrument_name,
        instrument_family
      )
    `,
      )
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_instruments')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, level: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_instruments')
      .update({ level })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
