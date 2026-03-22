import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabasePerRequestService {
  private readonly url = process.env.SUPABASE_URL!;
  private readonly anon = process.env.SUPABASE_ANON_KEY!;

  createClientForUser(userJwt: string): SupabaseClient {
    return createClient(this.url, this.anon, {
      global: {
        headers: {
          Authorization: `Bearer ${userJwt}`,
        },
      },
    });
  }

  async verifyTokenAndGetUserId(userJwt: string): Promise<string> {
    const client = this.createClientForUser(userJwt);
    const { data, error } = await client.auth.getUser();

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return data.user.id;
  }
}
