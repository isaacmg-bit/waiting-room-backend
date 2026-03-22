import { Module } from '@nestjs/common';
import { MusicianSearchService } from './musician-search.service';
import { MusicianSearchController } from './musician-search.controller';
import { FilterResolverService } from './musician-search.filter.resolver';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [MusicianSearchController],
  providers: [MusicianSearchService, FilterResolverService, SupabaseService],
  exports: [MusicianSearchService],
})
export class MusicianSearchModule {}
