import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/database.types';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private client: SupabaseClient<Database>;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getClient(): SupabaseClient<Database> {
    if (this.client) return this.client;

    const authHeader = this.request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    this.client = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        global: {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      },
    );

    return this.client;
  }
}
