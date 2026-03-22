import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  imports: [],
  controllers: [EventsController],
  providers: [
    EventsService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
  exports: [EventsService],
})
export class EventsModule {}
