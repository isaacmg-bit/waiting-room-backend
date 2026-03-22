import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserTheoryDto } from './dto/create-user-theory.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

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

      console.info(
        'Upsert user_theory - authUserId:',
        authUserId,
        'payload userId:',
        userId,
        'dto:',
        dto,
      );

      const { data, error } = await this.clientOrDefault(client)
        .from('user_theory')
        .upsert(
          {
            user_id: userId,
            knows_theory: dto.knows_theory,
            theory_level: dto.theory_level,
          },
          { onConflict: 'user_id' },
        )
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error in upsert', error);
        if (error.code === '42501') {
          throw new ForbiddenException(
            'Row-level security prevented this operation',
          );
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

      if (err.status && err.response) throw err;
      console.error('Unexpected error in upsert', err);
      throw new InternalServerErrorException('Unexpected server error');
    }
  }
}
