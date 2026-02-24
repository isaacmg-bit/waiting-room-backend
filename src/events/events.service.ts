import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class EventsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(dto: CreateEventDto): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .insert({
        title: dto.title,
        color: dto.color,
        event_date: dto.date,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async findAll(): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .select('*');

    if (error) throw error;

    return data?.map((event) => ({
      id: event.id,
      title: event.title,
      color: event.color,
      date: event.event_date,
    }));
  }

  async findOne(id: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      color: data.color,
      date: data.event_date,
    };
  }

  async update(id: string, dto: UpdateEventDto): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .update({
        title: dto.title,
        color: dto.color,
        event_date: dto.date,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async remove(id: string): Promise<any> {
    const { error } = await this.supabaseService
      .getClient()
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
