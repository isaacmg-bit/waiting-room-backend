import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdateUserProfileDto } from './dto/update-userprofile.dto';
import { CreateUserProfileDto } from './dto/create-userprofile.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async findAll(client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_profile')
      .select('');

    if (error) throw error;

    return data;
  }

  async findOne(id: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_profile')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserProfileDto,
    client?: SupabaseClient,
  ) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_profile')
      .update(updateUserDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async remove(id: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_profile')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async create(
    id: string,
    email: string,
    dto: CreateUserProfileDto,
    client?: SupabaseClient,
  ) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_profile')
      .insert({
        id,
        email,
        name: dto.name,
        location: dto.location,
        bio: dto.bio,
        gear: dto.gear,
        rehearsal_space: dto.rehearsal_space,
        location_point: dto.location_point,
        social_links: dto.social_links || [],
        role: 'user',
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}
