import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class LocationsService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async create(dto: CreateLocationDto, client?: SupabaseClient): Promise<any> {
    const { data, error } = await this.clientOrDefault(client)
      .from('locations')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async findAll(client?: SupabaseClient): Promise<any> {
    const { data, error } = await this.clientOrDefault(client)
      .from('locations')
      .select('*');

    if (error) throw error;

    return data;
  }

  async findOne(id: string, client?: SupabaseClient): Promise<any> {
    const { data, error } = await this.clientOrDefault(client)
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  }

  async update(
    id: string,
    dto: UpdateLocationDto,
    client?: SupabaseClient,
  ): Promise<any> {
    const { data, error } = await this.clientOrDefault(client)
      .from('locations')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async remove(id: string, client?: SupabaseClient): Promise<any> {
    const { error } = await this.clientOrDefault(client)
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
