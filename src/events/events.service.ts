import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private supabaseService: SupabaseService) {}

  private toWkt(location?: { lat: number; lng: number } | null): string | null {
    if (location === undefined || location === null) return null;
    const { lat, lng } = location as any;
    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      throw new BadRequestException(
        'location_point must be { lat: number, lng: number }',
      );
    }
    return `SRID=4326;POINT(${lng} ${lat})`;
  }

  async create(userId: string, dto: CreateEventDto) {
    const wkt = this.toWkt((dto as any).location_point);

    const insertPayload: any = {
      user_id: userId,
      event_date: dto.date,
      title: dto.title,
      color: dto.color,
      event_type: dto.event_type,
      is_public: dto.is_public,
      street: dto.street,
      location_point: wkt,
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .insert(insertPayload)
      .select('id')
      .single();

    if (error) throw error;

    const { data: row, error: rowErr } = await this.supabaseService
      .getClient()
      .from('events_with_location')
      .select('*')
      .eq('id', data.id)
      .single();

    if (rowErr) throw rowErr;
    return { ...row, date: row.event_date };
  }

  async findAllMe(userId: string): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events_with_location')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map((event) => ({
      ...event,
      date: event.event_date,
    }));
  }

  async findAllPublic(): Promise<any[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('events_with_location')
      .select('*')
      .eq('is_public', true);

    if (error) throw error;

    return (data || []).map((event) => ({
      ...event,
      date: event.event_date,
    }));
  }

  async findOne(id: string, userId: string): Promise<any> {
    const ownerRes = await this.supabaseService
      .getClient()
      .from('events_with_location')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (ownerRes.error && ownerRes.error.code !== 'PGRST116') {
      throw ownerRes.error;
    }

    if (ownerRes.data) {
      return { ...ownerRes.data, date: ownerRes.data.event_date };
    }

    const publicRes = await this.supabaseService
      .getClient()
      .from('events_with_location')
      .select('*')
      .eq('id', id)
      .eq('is_public', true)
      .single();

    if (publicRes.error || !publicRes.data) {
      throw new NotFoundException(
        'Event not found / You do not have permission',
      );
    }

    return { ...publicRes.data, date: publicRes.data.event_date };
  }

  async update(id: string, dto: UpdateEventDto, userId: string): Promise<any> {
    const hasLocationKey = Object.prototype.hasOwnProperty.call(
      dto,
      'location_point',
    );
    const wkt = hasLocationKey
      ? this.toWkt((dto as any).location_point)
      : undefined;

    const updatePayload: any = {
      event_date: dto.date,
      title: dto.title,
      color: dto.color,
      event_type: dto.event_type,
      is_public: dto.is_public,
      street: dto.street,
    };

    if (hasLocationKey) {
      updatePayload.location_point = wkt;
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('events')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id')
      .single();

    if (error) {
      throw new ForbiddenException('You cannot edit this event');
    }
    if (!data) throw new ForbiddenException('You cannot edit this event');

    const { data: row, error: rowErr } = await this.supabaseService
      .getClient()
      .from('events_with_location')
      .select('*')
      .eq('id', id)
      .single();

    if (rowErr) throw rowErr;
    return { ...row, date: row.event_date };
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
