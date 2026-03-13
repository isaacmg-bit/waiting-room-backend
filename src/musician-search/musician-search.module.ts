import { Module } from '@nestjs/common';
import { MusicianSearchService } from './musician-search.service';
import { MusicianSearchController } from './musician-search.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [MusicianSearchController],
  providers: [MusicianSearchService, SupabaseService],
  exports: [MusicianSearchService],
})
export class MusicianSearchModule {}
