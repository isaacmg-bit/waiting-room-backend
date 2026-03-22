import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserTheoryDto } from './dto/create-user-theory.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'src/database.types';

@Injectable()
export class UserTheoryService {
  constructor(private supabaseService: SupabaseService) {}

  private clientOrDefault(client?: SupabaseClient) {
    return client ?? this.supabaseService.getClient();
  }

  async findByUserId(userId: string, client?: SupabaseClient) {
    const { data, error } = await this.clientOrDefault(client)
      .from('user_theory')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error in findByUserId', error);
      throw new InternalServerErrorException('Database error');
    }

    return data;
  }

  async upsert(
    userId: string,
    dto: CreateUserTheoryDto,
    client?: SupabaseClient,
    authUserId?: string,
  ) {
    try {
      if (authUserId && authUserId !== userId) {
        console.warn('User id mismatch in upsert', { authUserId, userId });
        throw new ForbiddenException('You can only modify your own record');
      }

      const normalizedTheoryLevel =
        dto.knows_theory === false ? 'None' : (dto.theory_level ?? null);

      const allowedLevels = ['None', 'Basic', 'Intermediate', 'Advanced', null];
      if (!allowedLevels.includes(normalizedTheoryLevel)) {
        throw new BadRequestException('Invalid theory_level');
      }

      const payload: Database['public']['Tables']['user_theory']['Insert'] = {
        user_id: authUserId ?? userId, // prefer authUserId if provided
        knows_theory: dto.knows_theory,
        theory_level: normalizedTheoryLevel as string | null | undefined,
      };

      console.info(
        'Upsert user_theory - authUserId:',
        authUserId,
        'payload userId:',
        userId,
        'payload:',
        payload,
      );

      const { data, error } = await this.clientOrDefault(client)
        .from('user_theory')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error in upsert', error);

        if (error.code === '42501') {
          throw new ForbiddenException(
            'Row-level security prevented this operation',
          );
        }

        if (error.code === 'PGRST116') {
          return null;
        }

        throw new InternalServerErrorException('Database error');
      }

      if (!data) {
        throw new InternalServerErrorException(
          'Upsert did not return a record',
        );
      }

      return data;
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'status' in err &&
        'response' in err
      )
        throw err;
      console.error('Unexpected error in upsert', err);
      throw new InternalServerErrorException('Unexpected server error');
    }
  }
}
