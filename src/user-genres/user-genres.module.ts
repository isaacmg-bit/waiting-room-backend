import { Module } from '@nestjs/common';
import { UserGenresService } from './user-genres.service';
import { UserGenresController } from './user-genres.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [UserGenresController],
  providers: [
    UserGenresService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
})
export class UserGenresModule {}
