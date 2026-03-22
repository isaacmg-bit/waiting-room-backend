import { Module } from '@nestjs/common';
import { UserInstrumentsService } from './user-instruments.service';
import { UserInstrumentsController } from './user-instruments.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [UserInstrumentsController],
  providers: [
    UserInstrumentsService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
})
export class UserInstrumentsModule {}
