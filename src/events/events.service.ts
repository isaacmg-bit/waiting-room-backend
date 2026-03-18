import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class EventsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(userId: string, dto: CreateEventDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .insert({
        user_id: userId,
        event_date: dto.date,
        title: dto.title,
        color: dto.color,
        event_type: dto.event_type,
        is_public: dto.is_public,
        street: dto.street,
        location_point: dto.location_point,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAllMe(userId: string): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map((event) => ({
      ...event,
      date: event.event_date,
    }));
  }

  async findOne(id: string, userId: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data)
      throw new NotFoundException(
        'Event not found / You do not have permission',
      );

    return {
      ...data,
      date: data.event_date,
    };
  }

  async update(id: string, dto: UpdateEventDto, userId: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .update({
        event_date: dto.date,
        title: dto.title,
        color: dto.color,
        event_type: dto.event_type,
        is_public: dto.is_public,
        street: dto.street,
        location_point: dto.location_point,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data)
      throw new ForbiddenException('You cannot edit this event');

    return data;
  }

  async remove(id: string, userId: string): Promise<any> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error || !data || data.length === 0) {
      throw new ForbiddenException('You cannot delete this event');
    }

    return { message: 'Event deleted' };
  }
}
