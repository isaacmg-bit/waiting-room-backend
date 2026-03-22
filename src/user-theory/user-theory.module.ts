import { Module } from '@nestjs/common';
import { UserTheoryService } from './user-theory.service';
import { UserTheoryController } from './user-theory.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [UserTheoryController],
  providers: [
    UserTheoryService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
})
export class UserTheoryModule {}
