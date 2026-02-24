import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(dto: CreateLocationDto): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('locations')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async findAll(): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('locations')
      .select('*');

    if (error) throw error;

    return data;
  }

  async findOne(id: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('locations')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async remove(id: string): Promise<any> {
    const { error } = await this.supabaseService
      .getClient()
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
