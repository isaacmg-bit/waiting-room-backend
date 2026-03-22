import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [GenresController],
  providers: [
    GenresService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
})
export class GenresModule {}
