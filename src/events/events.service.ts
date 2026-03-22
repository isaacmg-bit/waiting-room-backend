import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private supabaseService: SupabaseService) {}

  private toWkt(location?: { lat: number; lng: number } | null): string | null {
    if (location === undefined || location === null) return null;

    const { lat, lng } = location;

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

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }

    return `SRID=4326;POINT(${lng} ${lat})`;
  }

  async create(userId: string, dto: CreateEventDto) {
    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    try {
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

      if (error) {
        throw new InternalServerErrorException(
          `Failed to create event: ${error.message}`,
        );
      }

      if (!data || !data.id) {
        throw new InternalServerErrorException('Failed to create event');
      }

      const { data: row, error: rowErr } = await this.supabaseService
        .getClient()
        .from('events_with_location')
        .select('*')
        .eq('id', data.id)
        .single();

      if (rowErr) {
        throw new InternalServerErrorException(
          `Failed to fetch created event: ${rowErr.message}`,
        );
      }

      return { ...row, date: row.event_date };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof InternalServerErrorException
      )
        throw err;
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async findAllMe(userId: string): Promise<any[]> {
    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('events_with_location')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to fetch events: ${error.message}`,
        );
      }

      return (data || []).map((event) => ({
        ...event,
        date: event.event_date,
      }));
    } catch (err) {
      if (err instanceof InternalServerErrorException) throw err;
      throw new InternalServerErrorException('Failed to fetch events');
    }
  }

  async findAllPublic(): Promise<any[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('events_with_location')
        .select('*')
        .eq('is_public', true);

      if (error) {
        throw new InternalServerErrorException(
          `Failed to fetch public events: ${error.message}`,
        );
      }

      return (data || []).map((event) => ({
        ...event,
        date: event.event_date,
      }));
    } catch (err) {
      if (err instanceof InternalServerErrorException) throw err;
      throw new InternalServerErrorException('Failed to fetch public events');
    }
  }

  async findOne(id: string, userId: string): Promise<any> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Event ID is required');
    }

    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const ownerRes = await this.supabaseService
        .getClient()
        .from('events_with_location')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

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
          'Event not found or you do not have permission to access it',
        );
      }

      return { ...publicRes.data, date: publicRes.data.event_date };
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Failed to fetch event');
    }
  }

  async update(id: string, dto: UpdateEventDto, userId: string): Promise<any> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Event ID is required');
    }

    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    try {
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

      if (error || !data) {
        throw new ForbiddenException(
          'You do not have permission to edit this event',
        );
      }

      const { data: row, error: rowErr } = await this.supabaseService
        .getClient()
        .from('events_with_location')
        .select('*')
        .eq('id', id)
        .single();

      if (rowErr) {
        throw new InternalServerErrorException(
          `Failed to fetch updated event: ${rowErr.message}`,
        );
      }

      return { ...row, date: row.event_date };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof ForbiddenException ||
        err instanceof InternalServerErrorException
      )
        throw err;
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async remove(id: string, userId: string): Promise<any> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Event ID is required');
    }

    if (!userId || userId.trim().length === 0) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select();

      if (error || !data || data.length === 0) {
        throw new ForbiddenException(
          'You do not have permission to delete this event',
        );
      }

      return { message: 'Event deleted successfully' };
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof ForbiddenException
      )
        throw err;
      throw new InternalServerErrorException('Failed to delete event');
    }
  }
}
