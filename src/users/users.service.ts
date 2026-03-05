import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*');

    if (error) throw error;

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
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
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async create(id: string, email: string, dto: CreateUserDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert({
        id,
        email,
        name: dto.name,
        location: dto.location,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}
