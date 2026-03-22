import { Injectable } from '@nestjs/common';
import { CreateUserBandDto } from './dto/create-user-band.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UserBandsService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async findByUserId(userId: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_bands')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async create(
    userId: string,
    dto: CreateUserBandDto,
    client?: SupabaseClient,
  ) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_bands')
      .insert({
        user_id: userId,
        band_id: dto.band_id,
        name: dto.name,
      })
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async remove(id: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_bands')
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
}
