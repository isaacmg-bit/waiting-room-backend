import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  imports: [],
  controllers: [LocationsController],
  providers: [
    LocationsService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
  exports: [LocationsService],
})
export class LocationsModule {}
