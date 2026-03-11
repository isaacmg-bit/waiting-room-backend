import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [GenresController],
  providers: [GenresService, SupabaseService],
})
export class GenresModule {}
