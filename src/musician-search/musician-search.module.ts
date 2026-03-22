import { Module } from '@nestjs/common';
import { MusicianSearchService } from './musician-search.service';
import { MusicianSearchController } from './musician-search.controller';
import { FilterResolverService } from './musician-search.filter.resolver';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [MusicianSearchController],
  providers: [
    MusicianSearchService,
    FilterResolverService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
  exports: [MusicianSearchService],
})
export class MusicianSearchModule {}
