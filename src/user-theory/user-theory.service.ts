import { Injectable } from '@nestjs/common';
import { CreateUserTheoryDto } from './dto/create-user-theory.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserTheoryService {
  constructor(private supabaseService: SupabaseService) {}

  async findByUserId(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_theory')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async upsert(userId: string, dto: CreateUserTheoryDto) {
    const { data, error } = await this.supabaseService
      .getClient()
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
