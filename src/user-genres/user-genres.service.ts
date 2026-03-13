import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateUserGenreDto } from './dto/create-user-genre.dto';

@Injectable()
export class UserGenresService {
  constructor(private supabaseService: SupabaseService) {}

  async findByUserId(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_genres')
      .select('*, genres(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async create(userId: string, dto: CreateUserGenreDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_genres')
      .insert({
        user_id: userId,
        genre_id: dto.genre_id,
      })
      .select('*, genres(*)')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_genres')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
