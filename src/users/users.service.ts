import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdateUserProfileDto } from './dto/update-userprofile.dto';
import { CreateUserProfileDto } from './dto/create-userprofile.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_profile')
      .select('*');

    if (error) throw error;

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_profile')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  async update(id: string, updateUserDto: UpdateUserProfileDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_profile')
      .update(updateUserDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_profile')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async create(id: string, email: string, dto: CreateUserProfileDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_profile')
      .insert({
        id,
        email,
        name: dto.name,
        location: dto.location,
        location_point: dto.location_point,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}
