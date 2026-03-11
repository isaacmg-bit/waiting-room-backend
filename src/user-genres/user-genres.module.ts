import { Module } from '@nestjs/common';
import { UserGenresService } from './user-genres.service';
import { UserGenresController } from './user-genres.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [UserGenresController],
  providers: [UserGenresService, SupabaseService],
})
export class UserGenresModule {}
