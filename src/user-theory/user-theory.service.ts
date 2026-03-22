import { Injectable } from '@nestjs/common';
import { CreateUserTheoryDto } from './dto/create-user-theory.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UserTheoryService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async findByUserId(userId: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_theory')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async upsert(
    userId: string,
    dto: CreateUserTheoryDto,
    client?: SupabaseClient,
  ) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_theory')
      .upsert(
        {
          user_id: userId,
          knows_theory: dto.knows_theory,
          theory_level: dto.theory_level,
        },
        { onConflict: 'user_id' },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
