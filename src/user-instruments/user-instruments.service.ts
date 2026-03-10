import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateUserInstrumentDto } from './dto/create-user-instrument.dto';

@Injectable()
export class UserInstrumentsService {
  constructor(private supabaseService: SupabaseService) {}

  async findByUser(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_instruments')
      .select('*, instruments(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async create(userId: string, dto: CreateUserInstrumentDto) {
    const { data, error } = await this.supabaseService
      .getClient()
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

  async remove(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_instruments')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
