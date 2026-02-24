import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [],
  controllers: [LocationsController],
  providers: [LocationsService, SupabaseService],
  exports: [LocationsService],
})
export class LocationsModule {}
