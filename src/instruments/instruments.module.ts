import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [InstrumentsController],
  providers: [
    InstrumentsService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
})
export class InstrumentsModule {}
