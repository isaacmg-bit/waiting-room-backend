import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabasePerRequestService } from 'src/supabase/supabase-per-request-service';
import { SupabaseTokenGuard } from 'src/supabase/supabase-token-guard';

@Module({
  controllers: [GalleryController],
  providers: [
    GalleryService,
    SupabaseService,
    SupabasePerRequestService,
    SupabaseTokenGuard,
  ],
})
export class GalleryModule {}
